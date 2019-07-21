import {env} from "../framework/Support/helpers";

export default {
    discord: {
        token: env('DISCORD_TOKEN'),
        settings: {
            table: 'settings'
        }
    }
}