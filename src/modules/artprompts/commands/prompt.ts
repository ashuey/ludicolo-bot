import { Command } from "@/common/Command";
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder, ButtonStyle } from "discord.js";
import { UnknownSubcommandError } from "@/common/errors/UnknownSubcommandError";
import { RuntimeError } from "@/common/errors/RuntimeError";
import { choose } from "@/helpers/random";
import Markov from 'markov-strings'
import {corpusSmall} from "@/modules/artprompts/data/corpus_small";
import {curatedPrompts} from "@/modules/artprompts/data/curated_prompts";

enum SUBCOMMANDS {
    RANDOM = 'random',
    AI_LOW = 'ai-low',
}

export class ArtPromptCommand implements Command {
    protected readonly markov: Markov;

    constructor() {
        this.markov = new Markov();
        this.markov.addData(corpusSmall);
    }
    build() {
        return (new SlashCommandBuilder())
            .setName('art-prompt')
            .setDescription('Gives a random art prompt')
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.RANDOM)
                .setDescription('Picks a random prompt from a list'))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.AI_LOW)
                .setDescription('Uses a low-quality AI to generate a prompt'));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case SUBCOMMANDS.RANDOM: {
                const prompt = choose(curatedPrompts);
                if (!prompt) {
                    throw new RuntimeError("Could not find random prompt");
                }
                return interaction.reply(`Art Prompt: ${prompt}`);
            }
            case SUBCOMMANDS.AI_LOW: {
                const prompt = this.markov.generate();

                const drawButton = new ButtonBuilder()
                    .setCustomId('com://art_prompts/draw_prompt')
                    .setLabel('Draw it for Me')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(drawButton);

                return interaction.reply({
                    content: `Art Prompt: ${prompt.string}`,
                    components: [row]
                });
            }
            default:
                throw new UnknownSubcommandError();
        }
    }
}
