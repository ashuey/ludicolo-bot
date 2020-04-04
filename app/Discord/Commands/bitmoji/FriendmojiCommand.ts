import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import {CommandoMessage} from "discord.js-commando";
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
                    label: 'friend',
                    prompt: '',
                    type: 'user'
                },
                {
                    key: 'name',
                    label: 'name',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandoMessage, { friend, name }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        friend = <User>friend;

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(msg.author);

        if (!bitmojiManagerUser) {
            await bitmojiManager.sendSetup(msg.author);
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