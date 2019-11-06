import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandMessage} from "discord.js-commando";
import UrlSigner from "../../../Http/UrlSigner";
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
                    label: 'Bitmoji Scene Name',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, { name }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');
        const urlSigner = app<UrlSigner>('url_signer');

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(msg.author);

        if (!bitmojiManagerUser) {
            const dm = await msg.author.createDM();
            const authUrl = urlSigner.sign(`https://defluo.serveo.net/auth/snapkit/login/${msg.author.id}`);
            await dm.send(`In order to use Bitmoji, you need to setup your account first. Click here to login:\n${authUrl}`);
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