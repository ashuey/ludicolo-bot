import { Knex } from "knex";
import { GUILDS_TABLE } from "@/common/tables";

export const create_guilds_table = async ({ schema }: Knex) => {
        return schema.createTable(GUILDS_TABLE, (t) => {
            t.string('discord_id', 24).primary();
            t.json('settings').notNullable();
        });
};
