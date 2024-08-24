import { Knex } from "knex";
import { Module } from "@/common/Module";
import { create_guilds_table } from "@/common/migrations/create_guilds_table";

export class SystemModule implements Module {
    readonly name = '_system';
    migrations: [string, Knex.Migration['up']][] = [
        ['create_guilds_table', create_guilds_table],
    ];
}
