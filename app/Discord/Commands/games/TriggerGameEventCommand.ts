import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default class TriggerGameEventCommand extends Command {
    protected gameManager: GameManager;

    constructor(client: CommandoClient) {
        super(client, {
            name: 'game-command',
            aliases: ['gamecommand', 'gcmd'],
            group: 'games',
            memberName: 'game-command',
            description: 'Dispatches the specified event to the chosen game',
            guildOnly: true,
            ownerOnly: true,

            args: [
                {
                    key: 'gameId',
                    label: 'Game ID',
                    prompt: '',
                    type: 'integer'
                },
                {
                    key: 'eventName',
                    label: 'Event Name',
                    prompt: '',
                    type: 'string'
                },
                {
                    key: 'args',
                    label: 'Arguments',
                    prompt: '',
                    type: 'string'
                }
            ]
        });

        this.gameManager = app('games');
    }

    async handle(msg: CommandoMessage, args: {gameId: number, eventName: string, args: string}): Promise<null> {
        const game = this.gameManager.getGameById(args.gameId);
        game.emit(args.eventName, ...args.args);
        return null;
    }
}