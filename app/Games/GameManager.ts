import {GuildMember, PartialTextBasedChannelFields} from "discord.js";
import JoinGameResult from "./JoinGameResult";
import Game, {GameStatic} from "./Game";
import PartialGuildMember from "./PartialGuildMember";

export default class GameManager {
    protected gameRegistry: { [key: string]: GameStatic } = {};

    protected gameInstances: Game[] = [];

    public register(key: string, game: GameStatic) {
        this.gameRegistry[key] = game;
    }

    public has(key: string) {
        return key in this.gameRegistry;
    }

    public get(key: string): GameStatic {
        return this.gameRegistry[key];
    }

    public async hostNewGame(key: string, host: GuildMember, announcementChannel: PartialTextBasedChannelFields): Promise<void> {
        const Game = this.get(key);
        const gameInstance = new Game(host);
        const gameId = this.gameInstances.push(gameInstance);
        await gameInstance.setup(gameId);
        await gameInstance.addPlayer(host);
        await gameInstance.announceIn(announcementChannel);
    }

    public async joinGame(member: PartialGuildMember, game_id: number): Promise<JoinGameResult> {
        if (game_id > this.gameInstances.length) {
            return JoinGameResult.INVALID_GAME_ID;
        }

        const game = this.getGameById(game_id);
        return game.addPlayer(member);
    }

    public async deleteGame(game_id: number) {
        const game = this.getGameById(game_id);
        await game.cleanup();
        delete this.gameInstances[game_id - 1];
    }

    public getGameById(game_id: number): Game {
        return this.gameInstances[game_id - 1];
    }
}