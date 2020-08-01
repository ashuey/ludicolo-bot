import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class FakeJoinGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args: { gameId: number, state: string }) {
        const game = this.gameManager.getGameById(args.gameId);

        game.pushStateByName(args.state);

        return msg.say(`Pushed state ${args.state} to game.`)
    }
}