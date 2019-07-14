import ServiceProvider from "../Support/ServiceProvider";
import { CommandoClient } from "discord.js-commando"

export default class DiscordServiceProvider extends ServiceProvider {
    register() {
        this.app.singleton('discord.client', CommandoClient);
    }
}