import { Snowflake } from "discord.js";
import { Knex } from "knex";
import { AutomodCleanupChannel } from "@/modules/automod/models/AutomodCleanupChannel";
import { CLEANUP_CHANNELS_TABLE } from "@/modules/automod/tables";

export class CleanupManager {
    protected readonly db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async get(channelId: Snowflake): Promise<AutomodCleanupChannel | undefined> {
        return this.db<AutomodCleanupChannel>(CLEANUP_CHANNELS_TABLE)
            .where('discord_id', channelId)
            .first();
    }

    async getAll(): Promise<AutomodCleanupChannel[]> {
        return this.db<AutomodCleanupChannel>(CLEANUP_CHANNELS_TABLE);
    }

    async enable(channelId: Snowflake, age: number): Promise<boolean> {
        await this.db<AutomodCleanupChannel>(CLEANUP_CHANNELS_TABLE)
            .insert({
                discord_id: channelId,
                maximum_age: age,
            })
            .onConflict('discord_id')
            .merge();

        return true;
    }

    async disable(channelId: Snowflake): Promise<void> {
        this.db<AutomodCleanupChannel>(CLEANUP_CHANNELS_TABLE)
            .where('discord_id', channelId)
            .del();
    }
}
