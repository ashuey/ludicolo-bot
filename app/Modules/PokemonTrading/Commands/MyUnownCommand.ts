import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage } from "discord.js-commando";
import * as moment from 'moment'
import UnownTradingService from "../Services/UnownTradingService";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class MyUnownCommand extends Command {
    protected tradingService: UnownTradingService;

    constructor(client) {
        super(client, {
            name: 'myunown',
            group: 'pogotrading',
            memberName: 'myunown',
            description: 'See unown you have marked for trading.'
        });

        this.tradingService = app('unown');
    }

    async handle(msg: CommandoMessage) {
        const letters = await this.tradingService.getLetters(msg.author);

        return msg.reply(`You have the following letters marked for trade:\n\n${letters.join(', ')}`);
    }
}