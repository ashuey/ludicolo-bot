import { Command } from "commander";
import { Application } from "@/index";
import {logger} from "@/logger";

export interface StartCommandArgs {
    cron: boolean;
}

export const start = (new Command('start'))
    .option("--no-cron", "Disables cron functionality")
    .action(async ({ cron }: StartCommandArgs) => {
        const app = new Application();

        await app.loginToPocketBase();
        if (cron) {
            app.startCron();
        } else {
            logger.warn("Started without cron functionality");
        }

        await app.login();
    });
