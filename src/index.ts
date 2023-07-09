import { InspireModule } from "@/modules/inspire";
import { Module } from "@/common/Module";
import { Configuration } from "@/config/Configuration";
import { config } from "@/config";
import {
    ChatInputCommandInteraction,
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Interaction,
    REST,
} from "discord.js";
import { ReadonlyCollection } from "@discordjs/collection";
import { Command } from "@/common/Command";
import knex, { Knex } from "knex";
import { getKnexConfig } from "@/database";
import { Application as BaseApplication } from "@/common/Application";
import { RuntimeError } from "@/common/RuntimeError";
import { fmtError } from "@/helpers/formatters";
import { EventsModule } from "@/modules/events";
import { AirQualityModule } from "@/modules/airquality";
import { DJTriviaModule } from "@/modules/djtrivia";

export class Application implements BaseApplication {
    readonly config: Readonly<Configuration>;

    readonly modules: Module[] = [
        new InspireModule(),
        new EventsModule(),
        new AirQualityModule(this),
        new DJTriviaModule(),
    ];

    readonly commands: ReadonlyCollection<string, Command>;

    protected _discord: Client | undefined;

    protected _rest: REST | undefined;

    protected _db: Knex | undefined;

    constructor() {
        this.config = config;
        this.commands = this.buildCommandCollection();
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

    get db(): Knex {
        if (!this._db) {
            this._db = knex(getKnexConfig(this.config.dbUrl));
        }

        return this._db;
    }

    public async login() {
        this.discord.once(Events.ClientReady, c => {
            console.log(`Connected to gateway as ${c.user.tag}`);
        });

        await this.discord.login(this.config.discordToken);
    }

    protected newDiscordClient(): Client {
        const client = (new Client({intents: [GatewayIntentBits.Guilds]}));
        client.on(Events.InteractionCreate, interaction => this.handleInteractionCreate(interaction));
        return client;
    }

    protected buildCommandCollection(): ReadonlyCollection<string, Command> {
        const commands: [string, Command][] = [];

        this.modules.forEach(module => {
            module.commands.forEach(command => {
                commands.push([command.build().name, command]);
            })
        })

        return new Collection(commands);
    }

    protected async handleInteractionCreate(interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            await this.handleCommand(interaction);
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
            let message = 'There was an error while executing this command!';

            if (error instanceof RuntimeError) {
                message = error.message;
            } else {
                console.error(error);
            }

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: fmtError(message), ephemeral: true });
            } else {
                await interaction.reply({ content: fmtError(message), ephemeral: true });
            }
        }
    }
}
