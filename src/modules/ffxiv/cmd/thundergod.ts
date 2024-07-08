import {Command} from "@/common/Command";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export class ThunderGodCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('thunder-god')
            .setDescription('Thunder God?')
    }

    async execute(interaction: ChatInputCommandInteraction) {
        return interaction.reply({
            files: ["https://i.imgur.com/fcyzVps.png"]
        })
    }
}
