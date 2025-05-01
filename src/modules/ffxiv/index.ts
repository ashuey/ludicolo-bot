import { Application } from "@/common/Application";
import { ThunderGodCommand } from "@/modules/ffxiv/cmd/thundergod";
import { XIVCommand } from "@/modules/ffxiv/cmd/xiv";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { Module } from "@/common/Module";

export class FFXIVModule implements Module, ApplicationProvider {
    readonly name = 'ffxiv';

    readonly commands = [
        new XIVCommand(),
        new ThunderGodCommand(),
    ]

    public readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
