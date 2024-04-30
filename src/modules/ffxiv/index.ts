import { Module } from "@/common/Module";
import { Application } from "@/common/Application";
import {sendEurekaWeather} from "@/modules/ffxiv/tasks/eureka-weather";
import {ScheduledTask} from "@/common/ScheduledTask";

export class FFXIVModule implements Module {
    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['*/6 * * * * *', () => sendEurekaWeather(this)],
    ];

    public readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
