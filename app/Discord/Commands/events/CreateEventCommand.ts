import Command from "@ashuey/ludicolo-discord/lib/Command";
import CommunityEvent from "../../../CommunityEvent";
import CommunityEventsManager from "../../../CommunityEvents/CommunityEventsManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class CreateEventCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create-event',
            aliases: ['createevent'],
            group: 'events',
            memberName: 'create-event',
            description: 'Create a new event',
            guildOnly: true,

            args: [
                {
                    key: 'name',
                    label: 'Event Name',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg, { name }) {
        const eventManager: CommunityEventsManager = app('community_events');

        const event = await CommunityEvent
            .query()
            .insert({
                name: name,
                guild: msg.guild.id
            });

        await eventManager.createCard(event, msg.channel);
    }
}