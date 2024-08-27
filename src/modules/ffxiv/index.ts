import { Knex } from "knex";
import { Module } from "@/common/Module";
import { Application } from "@/common/Application";
import { ScheduledTask } from "@/common/ScheduledTask";
import { CrabHitHandler, CrabSimCommand } from "@/modules/ffxiv/cmd/crabsim";
import { ComponentHandler } from "@/common/ComponentHandler";
import { sendEurekaWeather } from "@/modules/ffxiv/tasks/eureka-weather";
import { MsqCommand } from "@/modules/ffxiv/cmd/msq";
import { DynamisCommand } from "@/modules/ffxiv/cmd/dynamis";
import { ThunderGodCommand } from "@/modules/ffxiv/cmd/thundergod";
import { XIVCommand } from "@/modules/ffxiv/cmd/xiv";
import { create_static_data_table } from "@/modules/ffxiv/migrations/create_static_data_table";
import { StaticDataManager } from "@/modules/ffxiv/lib/staticdata";
import { AlertsManager } from "@/modules/ffxiv/AlertsManager";

export class FFXIVModule implements Module {
    readonly name = 'ffxiv';

    readonly commands = [
        new XIVCommand(),
        new CrabSimCommand(),
        new MsqCommand(),
        new DynamisCommand(),
        new ThunderGodCommand(),
    ]

    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['*/6 * * * * *', () => sendEurekaWeather(this)],
        ['* * * * * *', () => this.alerts.heartbeat()],
    ];

    readonly componentHandlers: [string, ComponentHandler][] = [
        ['hit_crab', new CrabHitHandler()],
    ];

    readonly migrations: [string, Knex.Migration['up']][] = [
        ['create_static_data_table', create_static_data_table]
    ]

    public readonly app: Application;

    public readonly staticData: StaticDataManager;

    public readonly alerts: AlertsManager;

    constructor(app: Application) {
        this.app = app;
        this.staticData = new StaticDataManager(app.db);
        this.alerts = new AlertsManager(app);
    }

    async bootstrap() {
        this.alerts.connect();
    }
}
