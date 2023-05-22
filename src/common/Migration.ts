import { Knex } from "knex";

export interface Migration {
    readonly name: string;

    up(knex: Knex): Promise<Knex.SchemaBuilder>;
}
