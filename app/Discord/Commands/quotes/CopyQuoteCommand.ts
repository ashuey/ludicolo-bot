import Command from "@ashuey/ludicolo-discord/lib/Command";
import Quote from "../../../Quote";
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed, Role} from "discord.js";

export default class DelQuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'copyquote',
            aliases: ['copy-quote'],
            group: 'quotes',
            memberName: 'copyquote',
            description: 'Copies a quote from another server to this one',
            guildOnly: true,
            ownerOnly: true,

            args: [
                {
                    key: 'qid',
                    label: 'ID',
                    prompt: '',
                    type: 'integer'
                }
            ]
        })
    }

    async handle(msg: CommandMessage, { qid }) {
        const quote = await Quote.query().findById(qid);

        if (!quote) {
            return this.sendFailedResponse(msg);
        }

        await Quote.query().insert({
            guild: msg.guild.id,
            creator: quote.creator,
            name: quote.name,
            text: quote.text
        });

        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Copied quote #${quote.id}: ${quote.name} to this server.`));
    }

    protected sendFailedResponse(msg: CommandMessage): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`**${msg.author.username}** No quote with that ID exists`));
    }
}