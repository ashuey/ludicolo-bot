import { Knex } from "knex";
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
import { AlertsManager } from "@/modules/ffxiv/alerts/AlertsManager";
import { ServiceProvider } from "@/modules/ffxiv/ServiceProvider";
import { Command } from "@/common/Command";

export class FFXIVModule implements ServiceProvider {
    readonly name = 'ffxiv';

    readonly commands: Command[];

    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['*/6 * * * * *', () => sendEurekaWeather(this)],
        ['*/30 * * * * *', () => this.alerts.heartbeat()],
    ];

    readonly componentHandlers: [string, ComponentHandler][] = [
        ['hit_crab', new CrabHitHandler()],
    ];

    readonly migrations: [string, Knex.Migration['up']][] = [
        ['create_static_data_table', create_static_data_table]
    ]

    public readonly app: Application;

    public readonly alerts: AlertsManager;

    constructor(app: Application) {
        this.app = app;
        this.alerts = new AlertsManager(app);

        this.commands = [
            new XIVCommand(this),
            new CrabSimCommand(),
            new MsqCommand(),
            new DynamisCommand(),
            new ThunderGodCommand(),
        ];
    }

    async bootstrap() {
        this.alerts.connect();
    }

    shutdown() {
        this.alerts.shutdown();
    }
}
