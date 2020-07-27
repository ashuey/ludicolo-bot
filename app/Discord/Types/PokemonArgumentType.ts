import { Argument, ArgumentType, CommandoClient, CommandoMessage } from "discord.js-commando";

export default class PokemonArgumentType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, 'pokemon');
    }

    parse(val: string, msg: CommandoMessage, arg: Argument): any {
        return super.parse(val, msg, arg);
    }

    validate(val: string, msg: CommandoMessage, arg: Argument): boolean | string | Promise<boolean | string> {
        return super.validate(val, msg, arg);
    }
}