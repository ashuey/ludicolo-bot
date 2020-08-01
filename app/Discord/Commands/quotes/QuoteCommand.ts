import Command from "@ashuey/ludicolo-discord/lib/Command";
import Quote from "../../../Quote";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import {Message, MessageEmbed} from "discord.js";

export default class QuoteCommand extends Command {
    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: {name: string}) {
        let query = Quote.query()
            .where('guild', msg.guild.id);

        if (args.name) {
            const nameIntVal = parseInt(args.name);

            if (nameIntVal >= 1) {
                query = query.where('id', nameIntVal);
            } else {
                query = query.where('name', args.name);
            }
        }

        const quotes = await query.limit(1).orderByRaw('RAND()');

        if (quotes.length != 1) {
            return this.sendFailedResponse(msg);
        }

        return msg.say(`\`\`#${quotes[0].id}\`\` :mega: ${quotes[0].text}`);
    }

    protected sendFailedResponse(msg: CommandoMessage): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`**${msg.author.username}** Could not find any quotes`));
    }
}