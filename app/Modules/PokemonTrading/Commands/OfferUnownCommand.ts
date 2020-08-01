import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage, CommandoClient } from "discord.js-commando";
import UnownTradingService from "../Services/UnownTradingService";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

interface CommandArguments {
    letters: Set<string>;
}

export default class OfferUnownCommand extends Command {
    protected tradingService: UnownTradingService;

    constructor(client: CommandoClient) {
        super(client, {
            name: 'offerunown',
            group: 'pogotrading',
            memberName: 'offerunown',
            description: 'Mark one or more unown letters as available for trade.',
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

    async handle(msg: CommandoMessage, args: CommandArguments) {
        await this.tradingService.offerMany(msg.author, args.letters);

        return msg.reply(`Added ${args.letters.size} unown to your offers.`);
    }
}