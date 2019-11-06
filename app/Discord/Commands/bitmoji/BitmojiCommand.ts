import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandMessage} from "discord.js-commando";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    protected get purgeCommand(): boolean {
        return false;
    }

    constructor(client) {
        super(client, {
            name: 'bitmoji',
            aliases: [],
            group: 'bitmoji',
            memberName: 'bitmoji',
            description: 'Posts your Bitmoji with a particular scene',
            guildOnly: true,

            args: [
                {
                    key: 'name',
                    label: 'name',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, { name }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(msg.author);

        if (!bitmojiManagerUser) {
            await bitmojiManager.sendSetup(msg.author);
            return;
        }

        const result = bitmojiManagerUser.findBitmoji(name);

        if (result) {
            await msg.say({
                files: [{
                    attachment: result.url,
                    name: 'bitmoji.png'
                }]
            });
        } else {
            await msg.reply("I couldn't find a Bitmoji that matches that query");
        }
    }
}