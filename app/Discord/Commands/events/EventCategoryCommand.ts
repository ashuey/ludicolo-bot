import Command from "@ashuey/ludicolo-discord/lib/Command";
import {isCategoryChannel} from "@ashuey/ludicolo-discord/lib/util";
import {CommandoMessage, CommandoClient} from "discord.js-commando";
import {GuildChannel} from "discord.js";

export default class EventCategoryCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'event-category',
            aliases: ['eventcategory', 'eventcat', 'event-cat', 'set-event-category', 'event_category'],
            group: 'events',
            memberName: 'event-category',
            description: 'Set the category where new events should be created',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],

            args: [
                {
                    key: 'category',
                    label: 'Category',
                    prompt: '',
                    type: 'channel'
                }
            ]
        })
    }

    async handle(msg: CommandoMessage, args: {category: GuildChannel}) {
        if (!isCategoryChannel(args.category)) {
            return msg.reply(`**${args.category.name}** is not a valid category.`);
        }

        const categoryId = args.category.id;

        await msg.guild.settings.set('event_category', categoryId);

        return msg.reply(`Set the event category to ${args.category.name}`);
    }
}