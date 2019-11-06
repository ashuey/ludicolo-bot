import Model from "@ashuey/ludicolo-framework/lib/Database/Mapper/Model";
import CommunityEvent from "./CommunityEvent";
import {Snowflake} from "discord.js";

export default class Attendee extends Model {
    public id: number;

    public event_id: number;

    public user: Snowflake;

    public party_size: number;

    static relationMappings = {
        event: {
            relation: Model.BelongsToOneRelation,
            modelClass: CommunityEvent,
            join: {
                from: 'attendees.event_id',
                to: 'community_events.id'
            }
        }
    }
}