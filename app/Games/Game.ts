import {
    APIMessage,
    ColorResolvable,
    Guild,
    GuildMember,
    Message, MessageAdditions,
    MessageEmbed, MessageOptions,
    PartialTextBasedChannelFields,
    Snowflake, SplitOptions, StringResolvable,
    TextChannel,
    VoiceChannel
} from "discord.js";
import JoinGameResult from "./JoinGameResult";
import PartialGuildMember from "./PartialGuildMember";
import State from "./StateMachine/State";
import LobbyState from "./LobbyState";
import NullState from "./NullState";
import StateMachine from "./StateMachine";
import DebuggableStateMachine from "./StateMachine/DebuggableStateMachine";

export interface GameStatic {
    new(host: GuildMember): Game
}

interface GameConfig {
    title: string;
    minPlayers?: number;
    maxPlayers?: number;
    voiceChannel?: boolean;
    color: ColorResolvable;
}

export default abstract class Game extends DebuggableStateMachine(StateMachine) implements PartialTextBasedChannelFields {
    protected guild: Guild;

    protected textChannel: TextChannel;

    protected voiceChannel: VoiceChannel;

    protected id: number;

    protected host: GuildMember;

    protected players = new Map<Snowflake, PartialGuildMember>();

    protected announcements: Message[] = [];

    protected readonly config: GameConfig;

    protected constructor(host: GuildMember, config: GameConfig) {
        super(NullState);
        this.host = host;
        this.guild = host.guild;
        this.config = Object.freeze(config);
        this.changeState(new LobbyState(this));
    }

    public async setup(id: number): Promise<void> {
        this.id = id;

        this.textChannel = await this.guild.channels.create(this.getChannelName(), {
            type: 'text',
            permissionOverwrites: [{
                id: this.guild.roles.everyone,
                deny: ['VIEW_CHANNEL']
            }]
        });

        if (this.config.voiceChannel === true) {
            this.voiceChannel = await this.guild.channels.create(this.getChannelName(), {
                type: 'voice',
                permissionOverwrites: [{
                    id: this.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                }]
            })
        }
    }

    protected getChannelName(): string {
        return `${this.config.title} ${this.id}`;
    }

    public async announceIn(channel: PartialTextBasedChannelFields) {
        const embed = this.getAnnouncementEmbed();
        const message = await channel.send(embed);
        this.announcements.push(message);
    }

    protected getAnnouncementEmbed(): MessageEmbed {
        return (new MessageEmbed())
            .setTitle(`Game #${this.id}: ${this.config.title}`)
            .setDescription(`**${this.host.displayName}** has started a new game of Secret Hitler!\n\nType \`\`!join ${this.id}\`\` to join the game`)
            .setColor(this.config.color);
    }

    public async addPlayer(guildMember: PartialGuildMember): Promise<JoinGameResult> {
        if (this.players.has(guildMember.user.id)) {
            return JoinGameResult.ALREADY_JOINED;
        }

        this.players.set(guildMember.user.id, guildMember);

        if (!guildMember.user.bot) {
            await this.textChannel.createOverwrite(guildMember.user.id, {
                VIEW_CHANNEL: true
            });

            if (this.voiceChannel) {
                await this.voiceChannel.createOverwrite(guildMember.user.id, {
                    VIEW_CHANNEL: true
                });
            }

            await this.postStartMessage(this.textChannel);
        }

        await this.textChannel.send(`${guildMember.user} has joined the lobby.`);

        return JoinGameResult.SUCCESS;
    }

    abstract getStartState(): State;

    public async cleanup() {
        if (this.textChannel) {
            await this.textChannel.delete();
        }

        if (this.voiceChannel) {
            await this.voiceChannel.delete();
        }
    }

    protected async postStartMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        const message = await channel.send(`${this.host} React with ✅ to begin the game`);
        await message.react('✅');
        const collector = message.createReactionCollector((reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === this.host.id
        });

        collector.on('collect', async (r, user) => {
            const startStatus = this.readyToStart();

            if (startStatus !== true) {
                await r.users.remove(user);
                await channel.send(new MessageEmbed().setColor('RED').setTitle(`Could not start game: ${startStatus}`));
                return;
            }

            collector.stop();
            this.emit('startGame');
            return message.delete();
        })
    }

    protected readyToStart(): true | string {
        if (this.players.size < this.config.maxPlayers) {
            return "Not enough players to start";
        }

        return true;
    }

    public async silence(voice: boolean = true): Promise<void> {
        await this.textChannel.updateOverwrite(this.guild.roles.everyone, {
            SEND_MESSAGES: false
        });

        if (voice && this.voiceChannel) {
            await this.voiceChannel.updateOverwrite(this.guild.roles.everyone, {
                SPEAK: false
            })
        }

        await this.send('The room has been silenced.')
    }

    public async unsilence(): Promise<void> {
        await this.textChannel.updateOverwrite(this.guild.roles.everyone, {
            SEND_MESSAGES: null
        });

        if (this.voiceChannel) {
            await this.voiceChannel.updateOverwrite(this.guild.roles.everyone, {
                SPEAK: null
            })
        }

        await this.send('The room has been unsilenced.');
    }

    public async clearChat(): Promise<void> {
        let deletedMessages;

        do {
            deletedMessages = await this.textChannel.bulkDelete(100);
        }
        while (deletedMessages.size >= 90);

    }

    public dumpState(): object {
        return {
            state: this.currentState.constructor.name
        }
    }

    get lastMessage(): Message | null {
        return this.textChannel.lastMessage;
    }

    get lastMessageID(): Snowflake | null {
        return this.textChannel.lastMessageID;
    }

    public getPlayers(): Map<Snowflake, PartialGuildMember> {
        return this.players;
    }

    public getTextChannel(): TextChannel {
        return this.textChannel;
    }

    send(options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<Message>;
    send(options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage): Promise<Message[]>;
    send(content: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<Message[]>;
    send(content: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage | (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | (MessageOptions & { split: true | SplitOptions })): Promise<Message> | Promise<Message[]> {
        return this.textChannel.send(content, options);
    }
}