import {AlertsManager} from "@/modules/ffxiv/alerts/AlertsManager";
import { Module } from "@/common/Module";
import { Application } from "@/common/Application";

export interface ServiceProvider extends Module {
    readonly app: Application;
    readonly alerts: AlertsManager;
}
