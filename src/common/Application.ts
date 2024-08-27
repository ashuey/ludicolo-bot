import { ReadonlyCollection } from "@discordjs/collection";
import { Client, REST } from "discord.js";
import { OpenAI } from "openai";
import { Knex } from "knex";
import { Command } from "@/common/Command";
import { Configuration } from "@/config/Configuration";
import { Module } from "@/common/Module";
import { LockManager } from "@/LockManager";
import { Cache } from "@/common/cache/Cache";

export interface Application {
    readonly isProduction: boolean;
    readonly config: Readonly<Configuration>;
    readonly modules: [string, Module][];
    readonly commands: ReadonlyCollection<string, Command>;
    readonly cache: Cache;
    readonly discord: Client;
    readonly rest: REST;
    readonly openai: OpenAI;
    readonly locks: LockManager;
    readonly db: Knex;
}
