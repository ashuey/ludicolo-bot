import { Knex } from "knex";
import { Module } from "@/common/Module";
import { Application } from "@/common/Application";
import { ServiceProvider } from "@/modules/automod/ServiceProvider";
import { CleanupManager } from "@/modules/automod/CleanupManager";
import { AutomodCommand } from "@/modules/automod/commands/automod";
import { ScheduledTask } from "@/common/ScheduledTask";
import { runCleanup } from "@/modules/automod/tasks/run-cleanup";
import { create_cleanup_channels_table } from "@/modules/automod/migrations/create_cleanup_channels_table";
import { AddRoleToAllCommand } from "@/modules/automod/commands/add-role-to-all";

export class AutomodModule implements Module, ServiceProvider {
    readonly name = 'automod';

    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['0 */20 * * * *', () => runCleanup(this)],
    ];

    readonly commands = [
        new AutomodCommand(this),
        new AddRoleToAllCommand(),
    ];

    readonly migrations: [string, Knex.Migration['up']][] = [
        ['create_cleanup_channels_table', create_cleanup_channels_table]
    ]

    readonly app: Application;

    readonly cleanup: CleanupManager;

    constructor(app: Application) {
        this.app = app;
        this.cleanup = new CleanupManager(app.db);
    }
}
