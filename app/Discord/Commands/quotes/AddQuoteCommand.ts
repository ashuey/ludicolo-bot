import Quote from "../../../Quote";
import {CommandoMessage, CommandoClient} from "discord.js-commando";
import {MessageEmbed} from "discord.js";
import Command from "@ashuey/ludicolo-discord/lib/Command";

export default class AddQuoteCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'addquote',
            aliases: ['add-quote'],
            group: 'quotes',
            memberName: 'addquote',
            description: 'Add a quote',
            guildOnly: true,

            args: [
                {
                    key: 'name',
                    label: 'Name',
                    prompt: '',
                    type: 'string',
                    validate: (val: string) => isNaN(parseInt(val, 10))
                },
                {
                    key: 'quote',
                    label: 'Text',
                    prompt: '',
                    type: 'string'
                }
            ]
        })
    }

    async handle(msg: CommandoMessage, args: { name: string, quote: string }) {
        await Quote.query().insert({
            guild: msg.guild.id,
            creator: msg.author.id,
            name: args.name,
            text: args.quote
        });

        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Quote Added`));
    }
}