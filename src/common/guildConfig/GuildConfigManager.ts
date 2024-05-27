import {Guild} from "@/common/models/Guild";
import PocketBase from "pocketbase/cjs";
import {JSONValue} from "@/common/JSONValue";
import AsyncLock from "async-lock";

export class GuildConfigManager {
    protected svc;

    protected lock: AsyncLock;

    constructor(pb: PocketBase, lock: AsyncLock) {
        this.svc = pb.collection<Guild>('guilds');
        this.lock = lock;
    }

    async get<T extends JSONValue = JSONValue>(guildId: string, key: string): Promise<T | undefined> {
        const guildData = await this.getGuildRecord(guildId);

        if (!guildData) {
            return undefined;
        }

        const existingConfig = guildData.settings;

        if (!this.configIsValid(existingConfig)) {
            return undefined;
        }

        return existingConfig[key] as T;
    }

    async set(guildId: string, key: string, val: JSONValue): Promise<void> {
        await this.lock.acquire(guildId, async () => {
            const guildData = await this.getGuildRecord(guildId);

            if (guildData) {
                let existingConfig = guildData.settings;

                if (!this.configIsValid(existingConfig)) {
                    existingConfig = {};
                }

                existingConfig[key] = val;

                await this.setGuildData(guildData.id, existingConfig);
            } else {
                await this.createGuildData(guildId, {
                    [key]: val,
                });
            }
        })
    }

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

    protected async createGuildData(guildId: string, data: JSONValue) {
        await this.svc.create({
            discord_id: guildId,
            settings: data,
        } as Guild);
    }

    protected async setGuildData(recordId: string, data: JSONValue): Promise<void> {
        await this.svc.update(recordId, {
            settings: data,
        });
    }

    protected configIsValid(config: unknown): config is Record<string, unknown> {
        return !(typeof config !== "object" || Array.isArray(config) || config === null);
    }
}
