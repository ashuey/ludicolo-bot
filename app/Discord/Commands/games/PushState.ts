import {CommandoMessage} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import JoinGameResult from "../../../Games/JoinGameResult";
import FakeGuildMember from "../../../Games/FakeGuildMember";
import * as stringifyObject from "stringify-object";
import * as _ from "lodash";
import Game from "../../../Games/Game";

export default class FakeJoinGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client) {
        super(client, {
            name: 'push-state',
            aliases: ['pushstate'],
            group: 'games',
            memberName: 'push-state',
            description: 'Pushes a new state on to the stack.',
            ownerOnly: true,

            args: [
                {
                    key: 'gameId',
                    label: 'Game ID',
                    prompt: '',
                    type: 'integer'
                },
                {
                    key: 'state',
                    label: 'State',
                    prompt: '',
                    type: 'string'
                }
            ]
        });

        this.gameManager = app('games');
    }

    async handle(msg: CommandoMessage, { gameId, state }) {
        const game = this.gameManager.getGameById(gameId);

        game.pushStateByName(state);

        return msg.say(`Pushed state ${state} to game.`)
    }
}