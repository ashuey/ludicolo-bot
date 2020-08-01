import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandoMessage, CommandoClient} from "discord.js-commando";
import { User } from "discord.js";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'sendbitmojisetup',
            aliases: [],
            group: 'bitmoji',
            memberName: 'sendbitmojisetup',
            description: 'Sends the Bitmoji setup prompt to a user',
            ownerOnly: true,

            args: [
                {
                    key: 'user',
                    label: 'user',
                    prompt: '',
                    type: 'user'
                }
            ]
        })
    }

    async handle(msg: CommandoMessage, args: { user: User }): Promise<null> {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        await bitmojiManager.sendSetup(args.user);

        return null;
    }
}