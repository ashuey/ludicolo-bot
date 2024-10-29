import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "@/common/Command";
import { choose } from "@/helpers/random";

export class ShikiCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('shiki')
            .setDescription('Selects a random meal from Shiki\'s menu');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const apps = [
            'Age Shumai',
            'Wasabi Shumai',
            'Gyoza',
            'Tempura',
            'Edamame',
            'Hiyashi Wakame',
            'Kara-age',
        ];

        const mains: [string, boolean][] = [
            ['Sushi Deluxe', true],
            ['Sushi & Sashimi Combination', true],
            ['Chirashi', true],
            ['A La Carte Rolls', true],
            ['A La Carte Nigiri', true],
            ['Ramen', false],
            ['Miso Ramen', false],
            ['Tonkotsu Ramen', false],
            ['Tempura Udon', false],
            ['Curry Udon', false],
            ['Katsu Curry', false],
            ['Pork Cutlet', false],
        ];

        const [main, mainIsSushi] = choose(mains) as [string, boolean];
        const appsPool = mainIsSushi ? [...apps] : ['Sushi', ...apps];
        const app = choose(appsPool);

        return interaction.reply({
            ephemeral: true,
            content: `Try this!\n\nAppetizer: ${app}\nMain: ${main}`,
        })
    }
}
