import {Module} from "@/common/Module";
import {Application} from "@/common/Application";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {CleanupManager} from "@/modules/automod/CleanupManager";

export class AutomodModule implements Module, ServiceProvider {
    readonly commands = [];

    readonly app: Application;

    readonly cleanup: CleanupManager;

    constructor(app: Application) {
        this.app = app;
        this.cleanup = new CleanupManager(app.pb);
    }
}
