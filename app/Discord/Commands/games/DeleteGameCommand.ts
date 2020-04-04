import {CommandoMessage} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import {MessageEmbed} from "discord.js";

export default class DeleteGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client) {
        super(client, {
            name: 'deletegame',
            aliases: ['delete-game'],
            group: 'games',
            memberName: 'deletegame',
            description: 'Deletes a game',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],

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
        await this.gameManager.deleteGame(gameId);
        return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`Deleted game #${gameId}`));
    }
}