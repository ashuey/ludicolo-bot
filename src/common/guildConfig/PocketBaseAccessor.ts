import {Guild} from "@/common/models/Guild";
import {RecordService} from "@/pocketBaseTypes";

export class PocketBaseAccessor /* implements GuildConfigAccessor */ {
    protected srv: RecordService<Guild>;

    constructor(srv: RecordService<Guild>) {
        this.srv = srv;
    }

    /* async load(guildId: string) {
        const records = this.srv.getFullList({
            filter: `discord_id = "${guildId}"`,
        });
    }

    async save(guildId: string, data: Record<string, unknown>) {
        return Promise.resolve(undefined);
    }*/

}
