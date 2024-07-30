import { Module } from "@/common/Module";
import { AICommand } from "@/modules/ai/commands/ai";
import { Application } from "@/common/Application";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import {XIVInspire} from "@/modules/ai/commands/XIVInspire";

export class AIModule implements Module, ApplicationProvider {
    readonly name = 'ai';

    readonly commands = [
        new AICommand(this),
        new XIVInspire(this),
    ];

    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
