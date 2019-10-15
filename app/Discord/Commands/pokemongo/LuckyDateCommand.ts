import Command from "../../../../framework/Discord/Command";
import {CommandMessage} from "discord.js-commando";
import * as moment from 'moment'

export default class LuckyDateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'luckydate',
            group: 'pokemongo',
            memberName: 'luckydate',
            description: 'Returns the date for pokemon to have been caught by for a higher change at luckies.'
        })
    }

    async handle(msg: CommandMessage) {
        const luckydate = moment().subtract(2, 'years');
        msg.say(`Any Pokémon older than **${luckydate.format('l')}** has the highest chance to become lucky.`)
    }
}