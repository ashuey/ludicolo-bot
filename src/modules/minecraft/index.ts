import { Module } from "@/common/Module";
import { WhitelistrProvider } from "@/modules/minecraft/WhitelistrProvider";
import { MinecraftConfigProvider } from "@/modules/minecraft/MinecraftConfigProvider";
import { Application } from "@/common/Application";
import { Whitelistr } from "@/modules/minecraft/apis/whitelistr";
import { MinecraftCommand } from "@/modules/minecraft/commands/minecraft";

export class MinecraftModule implements Module, WhitelistrProvider, MinecraftConfigProvider {
    readonly commands = [
        new MinecraftCommand(this)
    ];

    readonly migrations = [];

    protected app: Application;

    protected _whitelistr: Whitelistr | undefined;

    constructor(app: Application) {
        this.app = app;
    }

    get approvedGuild(): string {
        return this.app.config.minecraftGuild;
    }

    get minecraftServer(): string {
        return this.app.config.minecraftServer;
    }

    get whitelistr(): Whitelistr {
        if (!this._whitelistr) {
            this._whitelistr = new Whitelistr(this.app.config.whitelistrEndpoint, this.app.config.whitelistrKey);
        }

        return this._whitelistr;
    }
}
