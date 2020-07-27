import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage } from "discord.js-commando";
import * as moment from 'moment'
import UnownTradingService from "../Services/UnownTradingService";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";
import { MessageEmbed } from "discord.js";

interface CommandArguments {
    letters: Set<string>;
}

export default class FindUnownCommand extends Command {
    protected tradingService: UnownTradingService;

    constructor(client) {
        super(client, {
            name: 'findunown',
            group: 'pogotrading',
            memberName: 'findunown',
            description: 'Find users who have unown available for trade',
            args: [
                {
                    key: 'letters',
                    label: 'Letters',
                    prompt: '',
                    type: 'unown_letters'
                },
            ]
        });

        this.tradingService = app('unown');
    }

    async handle(msg: CommandoMessage, args) {
        const results: string[] = [];

        const letters = [...args.letters].sort();

        for (let letter of letters) {
            const users = await this.tradingService.findLetter(msg.guild, letter);

            results.push(`**${letter.toUpperCase()}: **${users.join(", ")}`)
        }

        const response = new MessageEmbed()
            .setTitle('Unown Trades')
            .setDescription(results.join("\n"));

        return msg.reply("Here's what we found:", response);
    }
}