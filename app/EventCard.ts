import {Channel, Client, Message, Snowflake} from "discord.js";
import CommunityEvent from "./CommunityEvent";
import CardType from "./CommunityEvents/CardType";
import {isTextChannel} from "@ashuey/ludicolo-discord/lib/util";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";

export default class EventCard extends Model {
    public event_id: number;

    public channel: Snowflake;

    public message: Snowflake;

    public type: CardType;

    protected $channel_: Channel;

    protected $message_: Message;

    public event: CommunityEvent;

    static get relationMappings() {
        const CommunityEvent_ = require('./CommunityEvent').default;
        return {
            event: {
                relation: Model.BelongsToOneRelation,
                modelClass: CommunityEvent_,
                join: {
                    from: 'event_cards.event_id',
                    to: 'community_events.id'
                }
            }
        }
    };

    public async $getChannel(): Promise<Channel> {
        if (!this.$channel_) {
            const discord: Client = await app('discord.client');
            this.$channel_ = discord.channels.get(this.channel);
        }

        return this.$channel_;
    }

    public async $getMessage(): Promise<Message> {
        if (!this.$message_) {
            const channel = await this.$getChannel();
            if (!isTextChannel(channel)) {
                throw new Error("Event Card Channel is not a TextChannel");
            }

            this.$message_ = await channel.fetchMessage(this.message);
        }

        return this.$message_;
    }
}