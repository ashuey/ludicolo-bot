import { Configuration } from "@/config/Configuration";
import { Module } from "@/common/Module";
import { ReadonlyCollection } from "@discordjs/collection";
import { Command } from "@/common/Command";
import { Client, REST } from "discord.js";
import { Knex } from "knex";
import OpenAI from "openai";

export interface Application {
    readonly config: Readonly<Configuration>;
    readonly modules: [string, Module][];
    readonly commands: ReadonlyCollection<string, Command>;
    readonly discord: Client;
    readonly rest: REST;
    readonly db: Knex;
    readonly openai: OpenAI;
}
