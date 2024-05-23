import { InspireModule } from "@/modules/inspire";
import { Module } from "@/common/Module";
import { Configuration } from "@/config/Configuration";
import { config } from "@/config";
import {
    ChatInputCommandInteraction,
    Client,
    Collection,
    CommandInteraction,
    Events,
    GatewayIntentBits,
    Interaction,
    MessageComponentInteraction,
    REST,
} from "discord.js";
import { ReadonlyCollection } from "@discordjs/collection";
import { Command } from "@/common/Command";
import { Application as BaseApplication } from "@/common/Application";
import { RuntimeError } from "@/common/errors/RuntimeError";
import { fmtError } from "@/helpers/formatters";
import { AirQualityModule } from "@/modules/airquality";
import { DJTriviaModule } from "@/modules/djtrivia";
import { ArtPromptModule } from "@/modules/artprompts";
import OpenAI from "openai";
import { ComponentHandler } from "@/common/ComponentHandler";
import { AIModule } from "@/modules/ai";
import cron from "node-cron";
import {FFXIVModule} from "@/modules/ffxiv";
import PocketBase from "pocketbase/cjs";
import {Guild} from "@/common/models/Guild";
import {GuildConfigManager} from "@/common/guildConfig/GuildConfigManager";
import {AutomodModule} from "@/modules/automod";
import {LockManager} from "@/LockManager";

type ReplyableInteraction = CommandInteraction | MessageComponentInteraction;

const componentInteractionRegex = /^com:\/\/(\w+\/\w+)$/;

export class Application implements BaseApplication {
    readonly config: Readonly<Configuration>;

    readonly modules: [string, Module][];

    readonly commands: ReadonlyCollection<string, Command>;

    readonly componentHandlers: ReadonlyCollection<string, ComponentHandler>;

    readonly guildConfig: GuildConfigManager;

    readonly pb: PocketBase;

    protected readonly lockManager: LockManager;

    protected _discord: Client | undefined;

    protected _rest: REST | undefined;

    protected _openai: OpenAI | undefined;

    constructor() {
        this.config = config;
        this.pb = new PocketBase(config.pocketBaseUrl);
        this.lockManager = new LockManager();

        this.modules = [
            ['inspire', new InspireModule()],
            ['air_quality', new AirQualityModule(this)],
            ['dj_trivia', new DJTriviaModule()],
            ['art_prompts', new ArtPromptModule(this)],
            ['ai', new AIModule(this)],
            ['ffxiv', new FFXIVModule(this)],
            ['automod', new AutomodModule(this)],
        ];
        this.commands = this.buildCommandCollection();
        this.componentHandlers = this.buildComponentHandlerCollection();
        this.guildConfig = new GuildConfigManager(this.pb);
    }

    get discord(): Client {
        if (!this._discord) {
            this._discord = this.newDiscordClient()
        }
        return this._discord;
    }

    get rest(): REST {
        if (this._discord) {
            return this._discord.rest;
        }

        if (!this._rest) {
            this._rest = (new REST()).setToken(this.config.discordToken);
        }

        return this._rest;
    }

    get openai(): OpenAI {
        if (!this._openai) {
            this._openai = new OpenAI({
                apiKey: this.config.openAiApiKey,
            });
        }

        return this._openai;
    }

    get locks(): LockManager {
        return this.lockManager;
    }

    public async login() {
        this.discord.once(Events.ClientReady, c => {
            console.log(`Connected to gateway as ${c.user.tag}`);

            this.firstTimeGuildSync();
        });

        await this.discord.login(this.config.discordToken);
    }

    public async loginToPocketBase() {
        await this.pb.admins.authWithPassword(this.config.pocketBaseUsername, this.config.pocketBasePassword);
    }

    public startCron() {
        this.modules.forEach(([, module]) => {
            if (module.scheduledTasks) {
                module.scheduledTasks.forEach(([cronExpression, func]) => {
                    cron.schedule(cronExpression, func);
                });
            }
        });
    }

    protected newDiscordClient(): Client {
        const client = (new Client({intents: [GatewayIntentBits.Guilds]}));
        client.on(Events.InteractionCreate, interaction => this.handleInteractionCreate(interaction));
        return client;
    }

    protected buildCommandCollection(): ReadonlyCollection<string, Command> {
        const commands: [string, Command][] = [];

        this.modules.forEach(([, module]) => {
            if (module.commands) {
                module.commands.forEach(command => {
                    commands.push([command.build().name, command]);
                });
            }
        });

        return new Collection(commands);
    }

    protected buildComponentHandlerCollection(): ReadonlyCollection<string, ComponentHandler> {
        const handlers: [string, ComponentHandler][] = [];

        this.modules.forEach(([moduleKey, module]) => {
            if (module.componentHandlers) {
                module.componentHandlers.forEach(([handlerKey, handler]) => {
                    handlers.push([`${moduleKey}/${handlerKey}`, handler]);
                })
            }
        })

        return new Collection(handlers);
    }

    protected async handleInteractionCreate(interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            await this.handleCommand(interaction);
        } else if (interaction.isMessageComponent()) {
            await this.handleComponentInteraction(interaction);
        }
    }

    protected async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            await interaction.reply('There was an error while executing this command!');
            return;
        }


        try {
            await command.execute(interaction);
        } catch (error) {
            await this.sendActionError(interaction, error, 'There was an error while executing this command!');
        }
    }

    protected async handleComponentInteraction(interaction: MessageComponentInteraction): Promise<void> {
        const handlerMatch = componentInteractionRegex.exec(interaction.customId);

        if (!handlerMatch) {
            // Might be handled elsewhere, ignore.
            return;
        }

        const handlerKey = handlerMatch[1];

        if (!handlerKey) {
            return;
        }

        const handler = this.componentHandlers.get(handlerKey);

        if (!handler) {
            console.error(`No component handler matching ${handlerKey} was registered.`);
            console.log(`Registered handlers: ${[...this.componentHandlers.keys()].join(", ")}`);
            await interaction.reply('There was an error while processing your request!');
            return;
        }

        try {
            await handler.handle(interaction);
        } catch (error) {
            await this.sendActionError(interaction, error, 'There was an error while processing your request!');
        }
    }

    protected async sendActionError(interaction: ReplyableInteraction, error: unknown, defaultMsg: string) {
        let message = defaultMsg;

        if (error instanceof RuntimeError && error.isPublic) {
            message = error.message;
        } else {
            console.error(error);
        }

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: fmtError(message), ephemeral: true});
            } else {
                await interaction.reply({content: fmtError(message), ephemeral: true});
            }
        } catch (e) {
            console.error(`Something went wrong while sending an error to the client: ${e}`);
        }
    }

    protected async firstTimeGuildSync() {
        const records = await this.pb.collection<Guild>('guilds').getFullList({
            fields: 'discord_id'
        });

        const knownGuildIds = records.map(record => record.discord_id);

        const guildIds = this.discord.guilds.cache.map(guild => guild.id);
        const unknownGuildIds = guildIds.filter(guildId => !knownGuildIds.includes(guildId));

        for (const guildId of unknownGuildIds) {
            await this. pb.collection<Guild>('guilds').create({
                discord_id: guildId,
            });
        }
    }
}
