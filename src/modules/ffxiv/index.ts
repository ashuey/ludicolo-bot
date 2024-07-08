import { Module } from "@/common/Module";
import { Application } from "@/common/Application";
import {ScheduledTask} from "@/common/ScheduledTask";
import {CrabHitHandler, CrabSimCommand} from "@/modules/ffxiv/cmd/crabsim";
import {ComponentHandler} from "@/common/ComponentHandler";
import {sendEurekaWeather} from "@/modules/ffxiv/tasks/eureka-weather";
import {MsqCommand} from "@/modules/ffxiv/cmd/msq";
import {DynamisCommand} from "@/modules/ffxiv/cmd/dynamis";
import {ThunderGodCommand} from "@/modules/ffxiv/cmd/thundergod";

export class FFXIVModule implements Module {
    readonly name = 'ffxiv';

    readonly commands = [
        new CrabSimCommand(),
        new MsqCommand(),
        new DynamisCommand(),
        new ThunderGodCommand(),
    ]

    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['*/6 * * * * *', () => sendEurekaWeather(this)],
    ];

    readonly componentHandlers: [string, ComponentHandler][] = [
        ['hit_crab', new CrabHitHandler()],
    ];

    public readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
