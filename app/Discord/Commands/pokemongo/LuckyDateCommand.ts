import Command from "@ashuey/ludicolo-discord/lib/Command";
import {CommandoMessage, CommandoClient} from "discord.js-commando";
import * as moment from 'moment'

export default class LuckyDateCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'luckydate',
            group: 'pokemongo',
            memberName: 'luckydate',
            description: 'Returns the date for pokemon to have been caught by for a higher change at luckies.'
        })
    }

    async handle(msg: CommandoMessage) {
        const luckydate = moment().subtract(2, 'years');
        return msg.say(`Any Pokémon older than **${luckydate.format('l')}** has the highest chance to become lucky.`)
    }
}