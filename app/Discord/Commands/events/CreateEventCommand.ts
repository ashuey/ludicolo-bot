import Command from "../../../../framework/Discord/Command";

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
        //
    }
}