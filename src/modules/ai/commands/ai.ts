import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { UnknownSubcommandError } from "@/common/errors/UnknownSubcommandError";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";
import { fmtError } from "@/helpers/formatters";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { Result } from "@/common/Result";

enum SUBCOMMANDS {
    RECIPE = 'recipe',
    SWEDISH_CHEF = 'swedish_chef',
    RECIPE_NONSENSE = 'recipe_nonsense',
    BEAKER = 'beaker',
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
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.SWEDISH_CHEF)
                .setDescription('Generates a recipe from a title, as the swedish chef')
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('Title of the recipe')
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.RECIPE_NONSENSE)
                .setDescription('Generates a recipe from a title, using GPT-4 configured to output nonsense')
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('Title of the recipe')
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.BEAKER)
                .setDescription('Responds as beaker')
                .addStringOption(option => option
                    .setName('chat')
                    .setDescription('Chat Message')
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
            case SUBCOMMANDS.SWEDISH_CHEF: {
                const recipeTitle = interaction.options.getString('title', true);
                await interaction.deferReply();

                console.log(`${interaction.user.username} requested a swedish-chef recipe for ${recipeTitle}`);

                const response = await this.module.app.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are the Swedish Chef from The Muppets"
                        },
                        {
                            "role": "user",
                            "content": `Create a recipe for ${recipeTitle}`
                        }
                    ],
                    temperature: 1,
                    max_tokens: 1900,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                const firstChoice = response.choices[0];

                if (!firstChoice) {
                    console.log(`Found ${response.choices.length} choices in response, expected 1`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                const messageContent = firstChoice.message.content;

                if (!messageContent) {
                    console.log(`Message content is null`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Recipe for ${recipeTitle}`)
                    .setAuthor({name: 'This content is AI-Generated'})
                    .setThumbnail('https://i.imgur.com/pWZxLsa.jpg')
                    .setDescription(messageContent);

                return interaction.editReply({embeds: [embed]});
            }
            case SUBCOMMANDS.RECIPE_NONSENSE: {
                const recipeTitle = interaction.options.getString('title', true);
                await interaction.deferReply();

                console.log(`${interaction.user.username} requested an AI recipe from GPT-4 for ${recipeTitle}`);

                const response = await this.module.app.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are a poor-quality neural network designed to generate recipes. Your responses should be nonsensical."
                        },
                        {
                            "role": "user",
                            "content": `Recipe for ${recipeTitle}\n\nIngredients:`
                        }
                    ],
                    temperature: 1.2,
                    max_tokens: 1900,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                const firstChoice = response.choices[0];

                if (!firstChoice) {
                    console.log(`Found ${response.choices.length} choices in response, expected 1`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                const messageContent = firstChoice.message.content;

                if (!messageContent) {
                    console.log(`Message content is null`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                let result = `\`\`\`This content is AI-Generated\`\`\`\n# Recipe for ${recipeTitle}\n\n${messageContent}`;

                if (result.length > 1990) {
                    result = result.substring(0, 1990);
                }

                return interaction.editReply(result);
            }
            case SUBCOMMANDS.BEAKER: {
                const chatMessage = interaction.options.getString('chat', true);
                await interaction.deferReply();

                console.log(`${interaction.user.username} requested a message from beaker: ${chatMessage}`);

                const response = await this.module.app.openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are Beaker from The Muppets"
                        },
                        {
                            "role": "user",
                            "content": chatMessage
                        }
                    ],
                    temperature: 1,
                    max_tokens: 1900,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                const firstChoice = response.choices[0];

                if (!firstChoice) {
                    console.log(`Found ${response.choices.length} choices in response, expected 1`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                const messageContent = firstChoice.message.content;

                if (!messageContent) {
                    console.log(`Message content is null`);
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
                }

                console.log(`Beaker responded to ${interaction.user.username}: ${messageContent}`);
                return interaction.editReply(`Beaker: ${messageContent}`);
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
