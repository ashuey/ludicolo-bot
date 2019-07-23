import ServiceProvider from "../Support/ServiceProvider";
import { CommandoClient } from "discord.js-commando"
import DatabaseSettingProvider from "./DatabaseSettingProvider";
import {config} from "../Support/helpers";

export default class DiscordServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('discord.client', () => {
            return new CommandoClient({
                owner: config('services.discord.owner')
            });
        });
        this.app.singleton('database_setting_provider', DatabaseSettingProvider, 'db');
        //this.app.make('discord.client').on('debug', msg => console.log(msg));
    }

    async boot(): Promise<void> {
        const client: CommandoClient = this.app.make('discord.client');
        // SetProvider won't resolve until the app is ready, so we must set the provider manually here.
        client.provider = this.app.make('database_setting_provider');
        await client.provider.init(client);
        console.log('finished booting discord service provider');
    }
}