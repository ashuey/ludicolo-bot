import {Snowflake} from "discord.js";
import PocketBase from "pocketbase/cjs";
import {AutomodCleanupChannel} from "@/modules/automod/models/AutomodCleanupChannel";

export class CleanupManager {
    protected readonly pb: PocketBase;

    constructor(pb: PocketBase) {
        this.pb = pb;
    }

    async enable(channelId: Snowflake, age: number): Promise<void> {
        await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .create({
                "discord_id": channelId,
                "maximum_age": age,
            });
    }

    async disable(channelId: Snowflake): Promise<void> {
        const record = await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .getFirstListItem(`discord_id="${channelId}"`);
        await this.pb.collection<AutomodCleanupChannel>('automod_cleanup_channels')
            .delete(record.id);
    }
}
