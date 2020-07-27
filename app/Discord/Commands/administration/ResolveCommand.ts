import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage } from "discord.js-commando";
import * as moment from 'moment'
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class OfferUnownCommand extends Command {
    constructor(client) {
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

    async handle(msg: CommandoMessage, {abstract}) {
        const resolved = app(abstract);

        if (typeof resolved === "object") {
            return msg.say(resolved.constructor.name);
        }

        return msg.say(resolved.toString());
    }
}