import { Command } from "commander";
import { Routes, RESTPutAPIApplicationCommandsResult } from "discord.js";
import { Application } from "@/index";

export const register = (new Command('register'))
    .action(async () => {
        const app = new Application();

        const commandData: unknown[] = [];

        app.modules.forEach(module => {
            module.commands.forEach(command => {
                commandData.push(command.build().toJSON());
            });
        });

        const response = await app.rest.put(
            Routes.applicationCommands(app.config.discordApplicationId),
            { body: commandData }
        ) as RESTPutAPIApplicationCommandsResult;

        console.log(`Successfully reloaded ${response.length} application (/) commands.`);
    });
