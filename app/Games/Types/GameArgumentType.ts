import {ArgumentType, CommandoClient} from "discord.js-commando";
import Game from "../Game";
import GameManager from "../GameManager";

export default class GameArgumentType extends ArgumentType {
    protected gameManager: GameManager;

    constructor(client: CommandoClient, gameManager: GameManager) {
        super(client, 'game');

        this.gameManager = gameManager;
    }

    validate(value: string): boolean {
        return this.gameManager.has(value);
    }

    parse(value: string): string {
        return value;
    }
}