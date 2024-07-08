import {Command} from "@/common/Command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

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
