import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { djTrivia } from "@/modules/djtrivia/djtrivia";
import dayjs from "dayjs";
import {logger} from "@/logger";

export class TriviaHintCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('dj-trivia-hint')
            .setDescription('Gets the most recent DJ Trivia Hint');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const [success, result] = await djTrivia.getLatest();

        if (!success) {
            logger.error(result);

            return interaction.reply({
                content: "Sorry, something went wrong.",
                ephemeral: true
            });
        }

        if (!result.published.isSame(dayjs(), 'day')) {
            return interaction.reply("No clue has been posted yet today.");
        }

        const response = (new EmbedBuilder())
            .setTitle(result.title)
            .setURL("https://www.djtrivia.com/cod/")
            .setDescription(result.content)
            .setColor('#ffcc33')
            .setTimestamp(result.published.toDate())
            .setFooter({ text: "Data provided by djtrivia.com" })

        return interaction.reply({embeds: [response]});
    }
}
