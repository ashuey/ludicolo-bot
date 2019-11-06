import CommunityEventsManager from "./CommunityEventsManager";
import {CommandoClient} from "discord.js-commando";
import ServiceProvider from "@ashuey/ludicolo-framework/lib/Support/ServiceProvider";

export default class CommunityEventsServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('community_events', app => {
            return new CommunityEventsManager();
        }, 'app')
    }

    async boot() {
        const client: CommandoClient = await this.app.make('discord.client');
        client.on('ready', () => {
            this.app.make('community_events').bootstrap();
        });
    }
}