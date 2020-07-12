import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";
import GameManager from "./GameManager";
import {CommandoClient} from "discord.js-commando";
import GameArgumentType from "./Types/GameArgumentType";
import SecretHitler from "./SecretHitler";

export default class GameServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton('games', GameManager);
    }

    async boot(): Promise<void> {
        const client: CommandoClient = await this.app.make('discord.client');
        const gameManager: GameManager = this.app.make('games');

        client.registry.registerType(new GameArgumentType(client, gameManager));

        gameManager.register('secret_hitler', SecretHitler);
    }
}