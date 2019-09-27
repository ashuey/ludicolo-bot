import DatabaseServiceProvider from "../framework/Database/DatabaseServiceProvider";
import DiscordServiceProvider from "../framework/Discord/DiscordServiceProvider";
import PokemonServiceProvider from "../app/Pokemon/PokemonServiceProvider";

export default {
    'providers': [
        DiscordServiceProvider,
        DatabaseServiceProvider,
        PokemonServiceProvider
    ]
}