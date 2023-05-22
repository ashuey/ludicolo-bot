import { Configuration } from "@/config/Configuration";
import { Module } from "@/common/Module";
import { ReadonlyCollection } from "@discordjs/collection";
import { Command } from "@/common/Command";
import { Client, REST } from "discord.js";
import { Knex } from "knex";

export interface Application {
    readonly config: Readonly<Configuration>;
    readonly modules: Module[];
    readonly commands: ReadonlyCollection<string, Command>;
    readonly discord: Client;
    readonly rest: REST;
    readonly db: Knex;
}
