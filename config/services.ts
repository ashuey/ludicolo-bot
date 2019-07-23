import {env} from "../framework/Support/helpers";

export default {
    discord: {
        token: env('DISCORD_TOKEN'),
        owner: env('DISCORD_OWNER'),
        settings: {
            table: 'settings'
        }
    }
}