import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UnknownSubcommandError } from "@/common/errors/UnknownSubcommandError";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";
import { fmtError } from "@/helpers/formatters";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { Result } from "@/common/Result";

enum SUBCOMMANDS {
    RECIPE = 'recipe',
}

export class AICommand implements Command {
    protected module: HuggingFaceProvider & ApplicationProvider;

    constructor(module: HuggingFaceProvider & ApplicationProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandBuilder())
            .setName('ai')
            .setDescription('Generates (usually low-quality) AI responses')
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.RECIPE)
                .setDescription('Generates a recipe from a title')
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('Title of the recipe')
                    .setRequired(true)));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case SUBCOMMANDS.RECIPE: {
                const recipeTitle = interaction.options.getString('title', true);
                await interaction.deferReply();

                console.log(`${interaction.user.username} requested an AI recipe for ${recipeTitle}`);

                let prompt = `Recipe for ${recipeTitle}\n\nIngredients:\n`
                const iterations = 2;

                for (let i = 0; i < iterations; i++) {
                    const [success, result] = await this.completion(prompt);

                    if (!success) {
                        console.log(`Text Generation error: ${result}`);
                        return interaction.editReply(fmtError("An error occurred during text generation. Please try again."));
                    }

                    prompt = result;
                }

                prompt = prompt.substring(0, 1960);
                prompt = prompt.substring(0, Math.min(prompt.length, prompt.lastIndexOf(" ")))

                prompt = `\`\`\`This content is AI-Generated\`\`\`\n# ${prompt}`

                return interaction.editReply(prompt);
            }
            default:
                throw new UnknownSubcommandError();
        }
    }

    protected async completion(input: string): Promise<Result<string>> {
        const [success, result] = await this.module.huggingFace.textGeneration('gpt2', {
            inputs: input,
            parameters: {
                //repetition_penalty: 2.0,
                max_new_tokens: 150,
                max_time: 60,
                //top_k: 20,
                //top_p: 20,
                num_return_sequences: 6,
                do_sample: true,
                temperature: 1.4
            },
            options: {
                use_cache: false
            }
        });

        if (!success) {
            return [success, result];
        }

        const longest = result.reduce(
            (a, b) => a.generated_text.length > b.generated_text.length ? a : b
        );

        return [true, longest.generated_text];
    }
}
