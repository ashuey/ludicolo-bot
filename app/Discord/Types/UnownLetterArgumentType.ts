import { Argument, ArgumentType, CommandoClient, CommandoMessage } from "discord.js-commando";

const unownLetters = /[a-z?!]/;

export default class PokemonArgumentType extends ArgumentType {
    constructor(client: CommandoClient) {
        super(client, 'unown_letters');
    }

    parse(val: string): Set<string> {
        return new Set(val.toLowerCase());
    }

    validate(val: string, msg: CommandoMessage, arg: Argument): boolean | string {
        const letters = this.parse(val);

        for (let letter of letters) {
            if (!unownLetters.test(letter)) {
                return `${letter} is not a valid Unown letter`;
            }
        }

        return true;
    }
}