import {CommandoMessage} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class HostGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client) {
        super(client, {
            name: 'hostgame',
            aliases: ['host-game', 'host'],
            group: 'games',
            memberName: 'hostgame',
            description: 'Starts a new game',
            guildOnly: true,

            args: [
                {
                    key: 'game',
                    label: 'Game',
                    prompt: '',
                    type: 'game'
                }
            ]
        });

        this.gameManager = app('games');
    }

    async handle(msg: CommandoMessage, { game }) {
        await this.gameManager.hostNewGame(game, msg.member, msg.channel);
    }
}