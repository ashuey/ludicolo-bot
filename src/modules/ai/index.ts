import { Module } from "@/common/Module";
import { AICommand } from "@/modules/ai/commands/ai";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";
import { Application } from "@/common/Application";
import { HuggingFace } from "@/modules/ai/huggingface";
import { ApplicationProvider } from "@/common/ApplicationProvider";

export class AIModule implements Module, HuggingFaceProvider, ApplicationProvider {
    readonly commands = [
        new AICommand(this),
    ];

    readonly app: Application;

    protected _huggingFace: HuggingFace | undefined;

    constructor(app: Application) {
        this.app = app;
    }

    get huggingFace(): HuggingFace {
        if (!this._huggingFace) {
            this._huggingFace = new HuggingFace(this.app.config.huggingFaceApiKey);
        }

        return this._huggingFace;
    }
}
