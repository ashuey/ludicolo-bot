import { Module } from "@/common/Module";
import { ArtPromptCommand } from "@/modules/artprompts/commands/prompt";
import { DrawPromptHandler } from "@/modules/artprompts/handlers/DrawPromptHandler";
import { Application } from "@/common/Application";
import { ApplicationProvider } from "@/common/ApplicationProvider";

export class ArtPromptModule implements Module, ApplicationProvider {
    readonly commands = [
        new ArtPromptCommand(),
    ];

    readonly migrations = [];

    readonly componentHandlers: [string, DrawPromptHandler][] = [
        ['draw_prompt', new DrawPromptHandler(this)],
    ];

    readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }
}
