import { Knex } from "knex";
import { Application } from "@/common/Application";
import { ThunderGodCommand } from "@/modules/ffxiv/cmd/thundergod";
import { XIVCommand } from "@/modules/ffxiv/cmd/xiv";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { Module } from "@/common/Module";
import { create_static_data_table } from "@/modules/ffxiv/migrations/create_static_data_table";

export class FFXIVModule implements Module, ApplicationProvider {
    readonly name = 'ffxiv';

    readonly migrations: [string, Knex.Migration['up']][] = [
        ['create_static_data_table', create_static_data_table]
    ]

    readonly commands = [
        new XIVCommand(),
        new ThunderGodCommand(),
    ]

    public readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
