import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import JoinGameResult from "../../../Games/JoinGameResult";

export default class JoinGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client: CommandoClient) {
        super(client, {
            name: 'join-game',
            aliases: ['joingame', 'join'],
            group: 'games',
            memberName: 'join-game',
            description: 'Joins a game',
            guildOnly: true,

            args: [
                {
                    key: 'gameId',
                    label: 'Game ID',
                    prompt: '',
                    type: 'integer'
                }
            ]
        });

        this.gameManager = app('games');
    }

    async handle(msg: CommandoMessage, args: { gameId: number }) {
        const result = await this.gameManager.joinGame(msg.member, args.gameId);

        switch (result) {
            case JoinGameResult.INVALID_GAME_ID:
                return msg.reply('That game does not exist.');
            case JoinGameResult.LOBBY_FULL:
                return msg.reply('Sorry, that game lobby is already full.')
        }
    }
}