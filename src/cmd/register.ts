import { Command } from "commander";
import { Routes, RESTPutAPIApplicationCommandsResult } from "discord.js";
import { Application } from "@/index";
import {logger} from "@/logger";

export const register = (new Command('register'))
    .action(async () => {
        const app = new Application();

        const commandData: unknown[] = [];

        app.modules.forEach(([, module]) => {
            if (module.commands) {
                module.commands.forEach(command => {
                    commandData.push(command.build().toJSON());
                });
            }
        });

        const response = await app.rest.put(
            Routes.applicationCommands(app.config.discordApplicationId),
            { body: commandData }
        ) as RESTPutAPIApplicationCommandsResult;

        logger.info(`Successfully reloaded ${response.length} application (/) commands.`);
    });
