import {Snowflake} from "discord.js";
import PocketBase from "pocketbase/cjs";
import {AutomodCleanupChannel} from "@/modules/automod/models/AutomodCleanupChannel";
import AsyncLock from "async-lock";

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

    async enable(channelId: Snowflake, age: number): Promise<void> {
        await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .create({
                "discord_id": channelId,
                "maximum_age": age,
            });
    }

    async disable(channelId: Snowflake): Promise<void> {
        return this.lock.acquire(channelId, async() => {
            const record = await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                .getFirstListItem(`discord_id="${channelId}"`);
            await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
                .delete(record.id);
        });
    }
}
