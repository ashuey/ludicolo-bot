import Command from "@ashuey/ludicolo-discord/lib/Command";
import {isCategoryChannel} from "@ashuey/ludicolo-discord/lib/util";

export default class EventCategoryCommand extends Command {
    constructor(client) {
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

    async handle(msg, {category}) {
        if (!isCategoryChannel(category)) {
            return msg.reply(`**${category.name}** is not a valid category.`);
        }

        const categoryId = category.id;

        await msg.guild.settings.set('event_category', categoryId);

        return msg.reply(`Set the event category to ${category.name}`);
    }
}