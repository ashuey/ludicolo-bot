import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "@/common/Command";

export class PingCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('ping')
            .setDescription('Test Command');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        return interaction.reply({
            ephemeral: true,
            content: "Pong!",
        });
    }
}
