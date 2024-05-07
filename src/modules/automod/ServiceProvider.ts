import {Application} from "@/common/Application";
import {CleanupManager} from "@/modules/automod/CleanupManager";

export interface ServiceProvider {
    readonly app: Application;
    readonly cleanup: CleanupManager;
}
