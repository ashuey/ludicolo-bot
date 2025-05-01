import { Knex } from "knex";
import { Module } from "@/common/Module";
import { create_guilds_table } from "@/common/migrations/create_guilds_table";
import { Application } from "@/common/Application";
import { AboutCommand } from "@/common/aboutCommand";
import { ApplicationProvider } from "@/common/ApplicationProvider";

export class SystemModule implements Module, ApplicationProvider {
    public readonly app: Application;

    readonly name = '_system';

    commands = [
        new AboutCommand(this),
    ];

    migrations: [string, Knex.Migration['up']][] = [
        ['create_guilds_table', create_guilds_table],
    ];

    constructor(app: Application) {
        this.app = app;
    }
}
