import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "@/common/Command";
import { inspiroBot } from "@/modules/inspire/inspirobot";
import {logger} from "@/logger";

export class InspireCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('inspire')
            .setDescription('Inspires you with an AI-generated quote from InspiroBot');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const [success, result] = await inspiroBot.newImage();

        if (!success) {
            return interaction.reply({
                content: "Sorry, we're running low on inspiration. (An error occurred)",
                ephemeral: true
            });
        }

        logger.info(`Bestowing inspiration upon ${interaction.user.username}: ${result}`);

        return interaction.reply({ files: [result] });
    }
}
