import Command from "../../../../framework/Discord/Command";
import Quote from "../../../Quote";
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";

export default class QuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            aliases: [],
            group: 'quotes',
            memberName: 'quote',
            description: 'Post a randomly selected quote, optionally filtered by name',
            guildOnly: true,

            args: [
                {
                    key: 'name',
                    label: 'Name',
                    prompt: '',
                    default: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, {name}) {
        let query = Quote.query()
            .where('guild', msg.guild.id);

        if (name) {
            const nameIntVal = parseInt(name);

            if (nameIntVal >= 1) {
                query = query.where('id', nameIntVal);
            } else {
                query = query.where('name', name);
            }
        }

        const quotes = await query.limit(1).orderByRaw('RAND()');

        if (quotes.length != 1) {
            return this.sendFailedResponse(msg);
        }

        return msg.say(`\`\`#${quotes[0].id}\`\` :mega: ${quotes['0'].text}`);
    }

    protected sendFailedResponse(msg: CommandMessage): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`**${msg.author.username}** Could not find any quotes`));
    }
}