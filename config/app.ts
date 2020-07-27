import PokemonServiceProvider from "../app/Pokemon/PokemonServiceProvider";
import CommunityEventsServiceProvider from "../app/CommunityEvents/CommunityEventsServiceProvider";
import RouteServiceProvider from "../app/Providers/RouteServiceProvider";
import UrlSignerServiceProvider from "../app/Providers/UrlSignerServiceProvider";
import BitmojiServiceProvider from "../app/Bitmoji/BitmojiServiceProvider";
import AuthServiceProvider from "../app/Providers/AuthServiceProvider";
import {env} from "@ashuey/ludicolo-framework/lib/Support/helpers";
import DiscordServiceProvider from "@ashuey/ludicolo-discord/lib/DiscordServiceProvider";
import DatabaseServiceProvider from "@ashuey/ludicolo-framework/lib/Database/DatabaseServiceProvider";
import SessionServiceProvider from "@ashuey/ludicolo-web/lib/SessionServiceProvider";
import HttpServiceProvider from "@ashuey/ludicolo-web/lib/HttpServiceProvider";
import GameServiceProvider from "../app/Games/GameServiceProvider";
import AppServiceProvider from "../app/Providers/AppServiceProvider";

export default {
    'key': env('APP_KEY'),

    'providers': [
        DiscordServiceProvider,
        DatabaseServiceProvider,
        PokemonServiceProvider,
        CommunityEventsServiceProvider,
        HttpServiceProvider,
        SessionServiceProvider,

        AppServiceProvider,
        RouteServiceProvider,
        UrlSignerServiceProvider,
        BitmojiServiceProvider,
        AuthServiceProvider,
        GameServiceProvider
    ]
}