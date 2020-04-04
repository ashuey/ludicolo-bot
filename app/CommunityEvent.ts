import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";
import {Channel, Guild, GuildCreateChannelOptions, MessageEmbed, Snowflake, TextChannel} from "discord.js";
import EventCard from "./EventCard";
import Attendee from "./Attendee";
import * as _ from 'lodash';
import CommunityEventsManager from "./CommunityEvents/CommunityEventsManager";
import {CommandoClient, GuildSettingsHelper} from "discord.js-commando";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import {isTextChannel} from "@ashuey/ludicolo-discord/lib/util";
const GuildSettingsHelperClass = require('discord.js-commando/src/providers/helper');

export default class CommunityEvent extends Model {
    public id: number;

    public name: string;

    public guild: Snowflake;

    public channel: Snowflake;

    public event_cards: EventCard[];

    public attendees: Attendee[];

    protected $client_: CommandoClient;

    protected $channel_: Channel;

    protected $guild_: Guild;

    // noinspection JSUnusedGlobalSymbols
    static get relationMappings() {
        const Attendee_ = require('./Attendee').default;
        return {
            event_cards: {
                relation: Model.HasManyRelation,
                modelClass: EventCard,
                join: {
                    from: 'community_events.id',
                    to: 'event_cards.event_id'
                }
            },
            attendees: {
                relation: Model.HasManyRelation,
                modelClass: Attendee_,
                join: {
                    from: 'community_events.id',
                    to: 'attendees.event_id'
                }
            }
        }
    };

    public async $cardContent(interior: boolean = false): Promise<MessageEmbed> {
        const attendees = await this.$getAttendees();
        const embed = new MessageEmbed()
            .setTitle(this.name)
            .addField('Participants', attendees, true);

        if (interior) {
            embed.setFooter( `Tap ❌ to leave this event. Tap a number to change your party size`);
        } else {
            embed.setFooter( `To join, tap ✅ below.`);
        }

        return embed;
    }

    public async $getAttendees(): Promise<number> {
        const result = await Attendee
            .knexQuery()
            .where('event_id', this.id)
            .sum('party_size as partySizeSum')
            .first();
        return result.partySizeSum || 0;
    }

    public async $getClient(): Promise<CommandoClient> {
        if (!this.$client_) {
            this.$client_ = await app('discord.client');
        }

        return this.$client_;
    }

    public async $getGuild(): Promise<Guild> {
        const client = await this.$getClient();

        if (!this.$guild_) {
            this.$guild_ = client.guilds.resolve(this.guild);
        }

        return this.$guild_;
    }

    public async $getChannel(): Promise<TextChannel> {
        if (!this.channel) {
            const channel_name = _.kebabCase(this.name);
            const guild = await this.$getGuild();
            const event_manager: CommunityEventsManager = app('community_events');
            const client = await this.$getClient();

            const settings_manager: GuildSettingsHelper = new GuildSettingsHelperClass(client, guild);

            const category_id: Snowflake | null = await settings_manager.get('event_category');

            const channel_data: GuildCreateChannelOptions = {
                type: "text",
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            };

            if (category_id) {
                channel_data.parent = category_id;
            }

            const channel = await guild.channels.create(channel_name, channel_data);

            if (!isTextChannel(channel)) {
                throw new Error("Created Event Channel is not a Text Channel");
            }

            await this.$query<CommunityEvent>().patch({
                channel: channel.id
            });

            await event_manager.createCard(this, channel, true);

            this.channel = channel.id;
            this.$channel_ = channel;
        } else if (!this.$channel_) {
            const client = await this.$getClient();
            this.$channel_ = await client.channels.fetch(this.channel);
        }

        const channel: Channel = this.$channel_;

        if (!isTextChannel(channel)) {
            throw new Error("Event Channel is not a TextChannel");
        }

        return channel;
    }
}