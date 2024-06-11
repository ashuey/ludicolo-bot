import { Module } from "@/common/Module";
import { AICommand } from "@/modules/ai/commands/ai";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";
import { Application } from "@/common/Application";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { HfInference } from "@huggingface/inference";
import {XIVInspire} from "@/modules/ai/commands/XIVInspire";

export class AIModule implements Module, HuggingFaceProvider, ApplicationProvider {
    readonly name = 'ai';
    
    readonly commands = [
        new AICommand(this),
        new XIVInspire(this),
    ];

    readonly app: Application;

    protected _huggingFace: HfInference | undefined;

    constructor(app: Application) {
        this.app = app;
    }

    get huggingFace(): HfInference {
        if (!this._huggingFace) {
            this._huggingFace = new HfInference(this.app.config.huggingFaceApiKey);
        }

        return this._huggingFace;
    }
}
