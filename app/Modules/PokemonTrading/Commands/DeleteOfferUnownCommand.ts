import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage, CommandoClient } from "discord.js-commando";
import UnownTradingService from "../Services/UnownTradingService";
import { app } from "@ashuey/ludicolo-framework/lib/Support/helpers";

interface CommandArguments {
    letters: Set<string>;
}

export default class DeleteOfferUnownCommand extends Command {
    protected tradingService: UnownTradingService;

    constructor(client: CommandoClient) {
        super(client, {
            name: 'deleteofferunown',
            group: 'pogotrading',
            memberName: 'deleteofferunown',
            description: 'Mark one or more unown letters as not available for trade.',
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
        const deletedCount = await this.tradingService.deleteOfferMany(msg.author, args.letters);

        return msg.reply(`Removed ${deletedCount} unown from your offers.`);
    }
}