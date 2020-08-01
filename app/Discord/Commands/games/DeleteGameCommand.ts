import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import {MessageEmbed} from "discord.js";

export default class DeleteGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client: CommandoClient) {
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

    async handle(msg: CommandoMessage, args:{gameId: number}) {
        await this.gameManager.deleteGame(args.gameId);
        if (!msg.channel.deleted) {
            return msg.embed(new MessageEmbed().setColor('GREEN').setTitle(`Deleted game #${args.gameId}`));
        }
    }
}