import {Module} from "@/common/Module";
import {Application} from "@/common/Application";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {CleanupManager} from "@/modules/automod/CleanupManager";
import {AutomodCommand} from "@/modules/automod/commands/automod";
import {LockResource} from "@/common/LockResource";
import {ScheduledTask} from "@/common/ScheduledTask";
import {runCleanup} from "@/modules/automod/tasks/run-cleanup";

export class AutomodModule implements Module, ServiceProvider {
    readonly name = 'automod';

    readonly scheduledTasks: [string, ScheduledTask][] = [
        ['0 */20 * * * *', () => runCleanup(this)],
    ];

    readonly commands = [
        new AutomodCommand(this),
    ];

    readonly app: Application;

    readonly cleanup: CleanupManager;

    constructor(app: Application) {
        this.app = app;
        this.cleanup = new CleanupManager(app.pb, app.locks.for(LockResource.AutomodCleanupChannels));
    }
}
