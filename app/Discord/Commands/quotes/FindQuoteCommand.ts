import Command from "../../../../framework/Discord/Command";
import Quote from "../../../Quote";
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";

export default class FindQuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'findquote',
            aliases: ['find-quote'],
            group: 'quotes',
            memberName: 'findquote',
            description: 'Search for a quote in the quote database',
            guildOnly: true,

            args: [
                {
                    key: 'query',
                    label: 'Query',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, { query }) {
        const quotes = await Quote.query()
            .where('guild', msg.guild.id)
            .where('text', 'like', `%${query}%`)
            .limit(1)
            .orderByRaw('RAND()');

        if (quotes.length != 1) {
            return this.sendFailedResponse(msg);
        }

        return msg.say(`\`\`#${quotes[0].id}\`\` :mega: ${quotes['0'].text}`);
    }

    protected sendFailedResponse(msg: CommandMessage): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`**${msg.author.username}** Could not find any quotes`));
    }
}