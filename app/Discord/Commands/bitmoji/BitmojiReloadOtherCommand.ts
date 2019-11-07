import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandMessage} from "discord.js-commando";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bitmoji-reload-other',
            aliases: ['bitmojireloadother'],
            group: 'bitmoji',
            memberName: 'bitmoji-reload-other',
            description: '',
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

    async handle(msg: CommandMessage, {user}) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(user);

        if (!bitmojiManagerUser) {
            await msg.reply("Could not find that user");
            return;
        }

        await bitmojiManagerUser.bootstrap();

        msg.reply(`Refreshed user ${user}`);
    }
}