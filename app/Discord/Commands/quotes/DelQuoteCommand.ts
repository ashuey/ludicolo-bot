import Command from "@ashuey/ludicolo-discord/lib/Command";
import Quote from "../../../Quote";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import {Message, MessageEmbed, Role} from "discord.js";

export default class DelQuoteCommand extends Command {
    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { qid: number }) {
        const quote = await Quote.query().findById(args.qid);

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

    protected sendSuccessResponse(msg: CommandoMessage, quote: Quote): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Removed quote #${quote.id}: ${quote.name} from the database.`));
    }

    protected sendFailedResponse(msg: CommandoMessage): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`**${msg.author.username}** No quote with that ID exists`));
    }

    protected sendUnauthorizedResponse(msg: CommandoMessage): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`**${msg.author.username}** You are not authorized to delete that quote`));
    }
}