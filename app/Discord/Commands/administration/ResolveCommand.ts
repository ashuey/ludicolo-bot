import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage, CommandoClient } from "discord.js-commando";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class OfferUnownCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'resolve',
            group: 'administration',
            memberName: 'resolve',
            description: '',
            args: [
                {
                    key: 'abstract',
                    label: 'Container Abstract',
                    prompt: '',
                    type: 'string'
                },
            ]
        })
    }

    async handle(msg: CommandoMessage, args: { abstract: string }) {
        const resolved = app(args.abstract);

        if (typeof resolved === "object") {
            return msg.say(resolved.constructor.name);
        }

        return msg.say(resolved.toString());
    }
}