import Command from "@ashuey/ludicolo-discord/lib/Command";
import { CommandoMessage } from "discord.js-commando";

export default class PokemonInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pokemon',
            group: 'pokemongo',
            memberName: 'pokemon',
            description: 'Get information about a pokemon'
        })
    }

    async handle(msg: CommandoMessage) {
        //
    }
}