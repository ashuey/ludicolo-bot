import Command from "@ashuey/ludicolo-discord/lib/Command";
import Quote from "../../../Quote";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import {Message, MessageEmbed, Role} from "discord.js";

export default class DelQuoteCommand extends Command {
    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { qid: number }) {
        const quote = await Quote.query().findById(args.qid);

        if (!quote) {
            return this.sendFailedResponse(msg);
        }

        await Quote.query().insert({
            guild: msg.guild.id,
            creator: quote.creator,
            name: quote.name,
            text: quote.text
        });

        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`**${msg.author.username}** Copied quote #${quote.id}: ${quote.name} to this server.`));
    }

    protected sendFailedResponse(msg: CommandoMessage): Promise<Message | Message[]> {
        return msg.embed(new MessageEmbed().setColor('RED').setTitle(`**${msg.author.username}** No quote with that ID exists`));
    }
}