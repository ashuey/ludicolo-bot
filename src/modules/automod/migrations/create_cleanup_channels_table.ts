import { Knex } from "knex";
import { CLEANUP_CHANNELS_TABLE } from "@/modules/automod/tables";

export const create_cleanup_channels_table = async ({ schema }: Knex) => {
    return schema.createTable(CLEANUP_CHANNELS_TABLE, (t) => {
        t.string('discord_id', 24).primary();
        t.integer('maximum_age').unsigned();
    });
};
