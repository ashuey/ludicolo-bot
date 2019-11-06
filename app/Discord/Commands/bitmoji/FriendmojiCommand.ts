import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandMessage} from "discord.js-commando";
import UrlSigner from "../../../Http/UrlSigner";
import BitmojiUser from "../../../BitmojiUser";
import {User} from "discord.js";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    protected get purgeCommand(): boolean {
        return false;
    }

    constructor(client) {
        super(client, {
            name: 'friendmoji',
            aliases: [],
            group: 'bitmoji',
            memberName: 'friendmoji',
            description: 'Posts your Friendmoji with a particular scene',
            guildOnly: true,

            args: [
                {
                    key: 'friend',
                    label: 'Friend to generate Friendmoji with',
                    prompt: '',
                    type: 'user'
                },
                {
                    key: 'name',
                    label: 'Bitmoji Scene Name',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, { friend, name }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');
        const urlSigner = app<UrlSigner>('url_signer');

        friend = <User>friend;

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(msg.author);

        // TODO: Remove duplicated code
        if (!bitmojiManagerUser) {
            const dm = await msg.author.createDM();
            const authUrl = urlSigner.sign(`https://defluo.serveo.net/auth/snapkit/login/${msg.author.id}`);
            await dm.send(`In order to use Bitmoji, you need to setup your account first. Click here to login:\n${authUrl}`);
            return;
        }

        const friendBitmojiUser = await BitmojiUser.query().findById(friend.id);

        if (!friendBitmojiUser) {
            msg.reply('Sorry, that user hasn\'t setup Bitmoji yet');
            return;
        }

        const result = bitmojiManagerUser.findFriendmoji(name);

        if (result) {
            const url = result.url.replace("%s", friendBitmojiUser.bitmoji_id);
            await msg.say({
                files: [{
                    attachment: url,
                    name: 'bitmoji.png'
                }]
            });
        } else {
            await msg.reply("I couldn't find a Friendmoji that matches that query");
        }
    }
}