import { Module } from "@/common/Module";
import { AQICommand } from "@/modules/airquality/commands/aqi";
import { Application } from "@/common/Application";
import { AirNow } from "@/modules/airquality/airnow";
import { AirNowProvider } from "@/modules/airquality/AirNowProvider";

export class AirQualityModule implements Module, AirNowProvider {
    readonly name = 'air_quality';

    readonly commands = [
        new AQICommand(this),
    ];
    readonly migrations = [];

    protected app: Application;

    protected _airNow: AirNow | undefined;

    constructor(app: Application) {
        this.app = app;
    }

    get airNow(): AirNow {
        if (!this._airNow) {
            this._airNow = new AirNow(this.app.config.airNowApiKey);
        }

        return this._airNow;
    }
}
