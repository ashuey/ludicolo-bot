import Command from "../../../../framework/Discord/Command";
import Quote from "../../../Quote";
import {CommandMessage} from "discord.js-commando";
import {Message, RichEmbed, Role} from "discord.js";

export default class DelQuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delquote',
            aliases: ['del-quote', 'deletequote', 'delete-quote'],
            group: 'quotes',
            memberName: 'delquote',
            description: 'Remove the quotation with the specified ID from the quotation database',
            guildOnly: true,

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

        if (quote.guild !== msg.guild.id) {
            return this.sendFailedResponse(msg);
        }

        if (!(msg.author.id === quote.creator || msg.member.hasPermission('ADMINISTRATOR'))) {
            return this.sendUnauthorizedResponse(msg);
        }

        await Quote.query().deleteById(quote.id);

        return this.sendSuccessResponse(msg, quote);
    }

    protected sendSuccessResponse(msg: CommandMessage, quote: Quote): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Removed quote #${quote.id}: ${quote.name} from the database.`));
    }

    protected sendFailedResponse(msg: CommandMessage): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`**${msg.author.username}** No quote with that ID exists`));
    }

    protected sendUnauthorizedResponse(msg: CommandMessage): Promise<Message | Message[]> {
        return msg.embed(new RichEmbed().setColor('RED').setTitle(`**${msg.author.username}** You are not authorized to delete that quote`));
    }
}