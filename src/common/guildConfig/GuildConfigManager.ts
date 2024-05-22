import {Guild} from "@/common/models/Guild";
import PocketBase from "pocketbase/cjs";
import {JSONValue} from "@/common/JSONValue";

export class GuildConfigManager {
    protected svc;

    constructor(pb: PocketBase) {
        this.svc = pb.collection<Guild>('guilds');
    }

    async get<T extends JSONValue = JSONValue>(guildId: string, key: string): Promise<T | undefined> {
        const guildData = await this.getGuildRecord(guildId);

        if (!guildData) {
            return undefined;
        }

        const existingConfig = guildData.settings;

        if (typeof existingConfig !== "object" || Array.isArray(existingConfig) || existingConfig === null) {
            return undefined;
        }

        return existingConfig[key] as T;
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
