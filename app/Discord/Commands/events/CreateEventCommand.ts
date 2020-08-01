import Command from "@ashuey/ludicolo-discord/lib/Command";
import CommunityEvent from "../../../CommunityEvent";
import CommunityEventsManager from "../../../CommunityEvents/CommunityEventsManager";
import {CommandoMessage, CommandoClient} from "discord.js-commando"
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import { TextChannel } from "discord.js";

export default class CreateEventCommand extends Command {
    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { name: string }): Promise<null> {
        const eventManager: CommunityEventsManager = app('community_events');

        const event = await CommunityEvent
            .query()
            .insert({
                name: args.name,
                guild: msg.guild.id
            });

        await eventManager.createCard(event, <TextChannel> msg.channel);

        return null
    }
}