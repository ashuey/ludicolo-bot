import Model from "../framework/Database/Mapper/Model";
import CommunityEvent from "./CommunityEvent";

export default class Attendee extends Model {
    static relationMappings = {
        owner: {
            relation: Model.BelongsToOneRelation,
            modelClass: CommunityEvent,
            join: {
                from: 'attendees.community_event_id',
                to: 'community_events.id'
            }
        }
    }
}