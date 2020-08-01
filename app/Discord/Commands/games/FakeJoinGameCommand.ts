import {CommandoMessage, CommandoClient} from "discord.js-commando";
import Command from "@ashuey/ludicolo-discord/lib/Command";
import GameManager from "../../../Games/GameManager";
import {app} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import JoinGameResult from "../../../Games/JoinGameResult";
import FakeGuildMember from "../../../Games/FakeGuildMember";

export default class FakeJoinGameCommand extends Command {
    protected gameManager: GameManager;

    constructor(client: CommandoClient) {
        super(client, {
            name: 'fake-join-game',
            aliases: ['fakejoingame', 'fake'],
            group: 'games',
            memberName: 'fake-join-game',
            description: 'Adds a fake player to a game',
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
                    key: 'count',
                    label: 'Number of fake users',
                    prompt: '',
                    type: 'integer',
                    default: 1
                }
            ]
        });

        this.gameManager = app('games');
    }

    async handle(msg: CommandoMessage, args: { gameId: number, count: number }) {
        for (let i = 0; i < args.count; i++) {
            const fakeUser = new FakeGuildMember(msg.member);
            const result = await this.gameManager.joinGame(fakeUser, args.gameId);

            switch (result) {
                case JoinGameResult.INVALID_GAME_ID:
                    return msg.reply('That game does not exist.');
                case JoinGameResult.LOBBY_FULL:
                    return msg.reply('Sorry, that game lobby is already full.')
            }
        }
    }
}