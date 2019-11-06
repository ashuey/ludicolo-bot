import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandMessage} from "discord.js-commando";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    constructor(client) {
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

    async handle(msg: CommandMessage, { user }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        await bitmojiManager.sendSetup(user);
    }
}