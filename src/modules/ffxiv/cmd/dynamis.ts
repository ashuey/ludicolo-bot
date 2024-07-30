import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "@/common/Command";

export class DynamisCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('dynamis')
            .setDescription('Dynamis?')
    }

    async execute(interaction: ChatInputCommandInteraction) {
        return interaction.reply({
            files: ["https://i.imgur.com/IxI8OdT.png"]
        })
    }
}
