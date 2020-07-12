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
            name: 'dump-state',
            aliases: ['dumpstate'],
            group: 'games',
            memberName: 'dump-state',
            description: 'Dumps the state of a game. May contain sensitive information.',
            ownerOnly: true,

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

    async handle(msg: CommandoMessage, { gameId }) {
        const gameState = this.gameManager.getGameById(gameId).dumpState();
        const stateString = stringifyObject(gameState, {
            singleQuotes: false,
            filter(obj, prop) {
                const originalObject = obj[prop];
                return typeof originalObject !== 'function';
            },
            transform(obj, prop, originalResult) {
                const originalObject = obj[prop];
                if (originalObject instanceof Game) {
                    return "[Game]";
                }

                if (originalObject instanceof Object && 'toString' in originalObject) {
                    const stringRepresentation = originalObject.toString();
                    if (_.startsWith(stringRepresentation, '[object')) {
                        return originalResult;
                    }

                    return `"${stringRepresentation}"`;
                }

                return originalResult;
            }
        });

        if (stateString.length > 1900) {
            console.log(stateString);
            return msg.reply('State is too large to display in message. Please see bot console.');
        }

        return msg.say("```json\n" + stateString + "```");
    }
}