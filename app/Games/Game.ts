import {
    ColorResolvable,
    Guild,
    GuildMember,
    Message,
    MessageEmbed,
    PartialTextBasedChannelFields,
    Snowflake,
    TextChannel,
    VoiceChannel
} from "discord.js";
import PartialUser from "./PartialUser";
import JoinGameResult from "./JoinGameResult";

export interface GameStatic { new(host: GuildMember): Game }

interface GameConfig {
    title: string;
    minPlayers?: number;
    maxPlayers?: number;
    voiceChannel?: boolean;
    color: ColorResolvable;
}

export default abstract class Game {
    protected guild: Guild;

    protected textChannel: TextChannel;

    protected voiceChannel: VoiceChannel;

    protected id: number;

    protected host: GuildMember;

    protected players = new Map<Snowflake, PartialUser>();

    protected announcements: Message[] = [];

    protected readonly config: GameConfig;

    protected constructor(host: GuildMember, config: GameConfig) {
        this.host = host;
        this.guild = host.guild;
        this.config = Object.freeze(config);
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

    public async addPlayer(user: PartialUser): Promise<JoinGameResult> {
        if (this.players.has(user.id)) {
            return JoinGameResult.ALREADY_JOINED;
        }

        this.players.set(user.id, user);

        if (!user.bot) {
            await this.textChannel.createOverwrite(user.id, {
                VIEW_CHANNEL: true
            });

            if (this.voiceChannel) {
                await this.voiceChannel.createOverwrite(user.id, {
                    VIEW_CHANNEL: true
                });
            }

            await this.postStartMessage(this.textChannel);
        }

        await this.textChannel.send(`${user} has joined the lobby.`);

        return JoinGameResult.SUCCESS;
    }

    abstract start();

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
            await this.start();
        })
    }

    protected readyToStart(): true | string {
        if (this.players.size < this.config.maxPlayers) {
            return "Not enough players to start";
        }

        return true;
    }
}