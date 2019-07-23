import DatabaseServiceProvider from "../framework/Database/DatabaseServiceProvider";
import DiscordServiceProvider from "../framework/Discord/DiscordServiceProvider";

export default {
    'providers': [
        DiscordServiceProvider,
        DatabaseServiceProvider
    ]
}