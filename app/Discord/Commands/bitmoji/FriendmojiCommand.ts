import Command from "@ashuey/ludicolo-discord/lib/Command";
import BitmojiManager from "../../../Bitmoji/BitmojiManager";
import { CommandoMessage, CommandoClient } from "discord.js-commando";
import BitmojiUser from "../../../BitmojiUser";
import { User } from "discord.js";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class BitmojiCommand extends Command {
    protected get purgeCommand(): boolean {
        return false;
    }

    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { friend: User, name: string }) {
        const bitmojiManager = app<BitmojiManager>('bitmoji');

        const bitmojiManagerUser = await bitmojiManager.getByDiscordUser(msg.author);

        if (!bitmojiManagerUser) {
            await bitmojiManager.sendSetup(msg.author);
            return;
        }

        const friendBitmojiUser = await BitmojiUser.query().findById(args.friend.id);

        if (!friendBitmojiUser) {
            msg.reply('Sorry, that user hasn\'t setup Bitmoji yet');
            return;
        }

        const result = bitmojiManagerUser.findFriendmoji(args.name);

        if (result) {
            const url = result.url.replace("%s", friendBitmojiUser.bitmoji_id);
            return msg.say({
                files: [{
                    attachment: url,
                    name: 'bitmoji.png'
                }]
            });
        }

        return msg.reply("I couldn't find a Friendmoji that matches that query");
    }
}