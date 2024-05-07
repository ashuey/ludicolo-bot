import { Command } from "commander";
import { Application } from "@/index";

export const start = (new Command('start'))
    .action(async () => {
        const app = new Application();

        await app.loginToPocketBase();
        app.startCron();

        await app.login();
    });
