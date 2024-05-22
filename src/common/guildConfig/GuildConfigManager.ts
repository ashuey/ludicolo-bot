import {Guild} from "@/common/models/Guild";
import PocketBase from "pocketbase/cjs";
import {JSONValue} from "@/common/JSONValue";

export class GuildConfigManager {
    protected svc;

    constructor(pb: PocketBase) {
        this.svc = pb.collection<Guild>('guilds');
    }

    async get<T = JSONValue, V extends JSONValue | undefined = undefined>(guildId: string, key: string, defVal: V): Promise<T | V> {
        const guildData = await this.getGuildRecord(guildId);

        if (!guildData) {
            return defVal;
        }

        const existingConfig = guildData.settings;

        if (typeof existingConfig !== "object" || Array.isArray(existingConfig) || existingConfig === null) {
            return defVal;
        }

        return existingConfig[key] as T ?? defVal;
    }

    /*async set(guildId: string, key: string, val: JSONValue): Promise<void> {
        //
    }*/

    protected async getGuildRecord(guildId: string): Promise<Guild | undefined> {
        const result = await this.svc.getList(1, 1, {
            filter: `discord_id="${guildId}"`,
            skipTotal: true,
        });

        if (result.items.length === 0) {
            return undefined;
        }

        return result.items[0];
    }
}
