import {Module} from "@/common/Module";
import {Application} from "@/common/Application";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {CleanupManager} from "@/modules/automod/CleanupManager";
import {AutomodCommand} from "@/modules/automod/commands/automod";
import AsyncLock from "async-lock";

export class AutomodModule implements Module, ServiceProvider {
    readonly commands = [
        new AutomodCommand(this),
    ];

    readonly app: Application;

    readonly cleanup: CleanupManager;

    constructor(app: Application) {
        this.app = app;
        // TODO: Fix
        this.cleanup = new CleanupManager(app.pb, new AsyncLock()); // app.locks.for(LockResource.AutomodCleanupChannels));
    }
}
