import { Command } from "commander";
import { Application } from "@/index";

export const start = (new Command('start'))
    .action(() => {
        const app = new Application();

        app.login();
    });
