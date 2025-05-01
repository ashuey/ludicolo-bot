import { Knex } from "knex";
import { STATIC_DATA_TABLE } from "@/modules/ffxiv/tables";

export const create_static_data_table = async (knex: Knex) => {
    await knex.schema.createTable(STATIC_DATA_TABLE, (t) => {
        t.string('key', 32).primary();
        t.json('data').notNullable();
        t.timestamp('updated_at').notNullable();
    });
};
