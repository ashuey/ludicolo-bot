import {Snowflake} from "discord.js";
import PocketBase from "pocketbase/cjs";
import AsyncLock from "async-lock";
import {AutomodCleanupChannel} from "@/modules/automod/models/AutomodCleanupChannel";

export class CleanupManager {
    protected readonly pb: PocketBase;

    protected readonly lock: AsyncLock;

    constructor(pb: PocketBase, lock: AsyncLock) {
        this.pb = pb;
        this.lock = lock;
    }

    async get(channelId: Snowflake): Promise<AutomodCleanupChannel | undefined> {
        const result = await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .getList(1, 1, {
                filter: `discord_id="${channelId}"`,
                skipTotal: true,
            });

        return result.items.length > 0 ? result.items[0] : undefined;
    }

    async getAll(): Promise<AutomodCleanupChannel[]> {
        return this.pb
            .collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .getFullList();
    }

    async enable(channelId: Snowflake, age: number): Promise<boolean> {
        return this.lock.acquire(channelId, async () => {
            const current = await this.get(channelId);

            if (current) {
                await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                    .update(current.id, {
                        "maximum_age": age,
                    });

                return false;
            }

            await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                .create({
                    "discord_id": channelId,
                    "maximum_age": age,
                });

            return true;
        });
    }

    async disable(channelId: Snowflake): Promise<void> {
        return this.lock.acquire(channelId, async () => {
            const record = await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                .getFirstListItem(`discord_id="${channelId}"`);
            await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                .delete(record.id);
        });
    }
}
