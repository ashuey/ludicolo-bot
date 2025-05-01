import { Module } from "@/common/Module";
import { Application } from "@/common/Application";

export interface ServiceProvider extends Module {
    readonly app: Application;
}
