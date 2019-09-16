import Command from "../../../../framework/Discord/Command";
import Quote from "../../../Quote";
import {CommandMessage} from "discord.js-commando";
import {RichEmbed} from "discord.js";

export default class AddQuoteCommand extends Command {
    constructor(client) {
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
                    validate: val => isNaN(parseInt(val, 10))
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

    async handle(msg: CommandMessage, { name, quote }) {
        await Quote.query().insert({
            guild: msg.guild.id,
            creator: msg.author.id,
            name: name,
            text: quote
        });

        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Quote Added`));
    }
}