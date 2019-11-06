import {env} from "@ashuey/ludicolo-framework/lib/Support/helpers";

export default {
    token: env('DISCORD_TOKEN'),
    owner: env('DISCORD_OWNER'),
    unknownCommandResponse: false
}