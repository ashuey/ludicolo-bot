import { Configuration } from "@/config/Configuration";
import { Module } from "@/common/Module";
import { ReadonlyCollection } from "@discordjs/collection";
import { Command } from "@/common/Command";
import { Client, REST } from "discord.js";
import OpenAI from "openai";
import PocketBase from "pocketbase/cjs";
import {LockManager} from "@/LockManager";
import {Cache} from "@/common/cache/Cache";

export interface Application {
    readonly config: Readonly<Configuration>;
    readonly modules: [string, Module][];
    readonly commands: ReadonlyCollection<string, Command>;
    readonly cache: Cache;
    readonly discord: Client;
    readonly rest: REST;
    readonly openai: OpenAI;
    readonly pb: PocketBase;
    readonly locks: LockManager;
}
