import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UnknownSubcommandError } from "@/common/errors/UnknownSubcommandError";
import { HuggingFaceProvider } from "@/modules/ai/HuggingFaceProvider";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { OpenAIHelper } from "@/modules/ai/helpers/OpenAIHelper";
import { HuggingFaceHelper } from "@/modules/ai/helpers/HuggingFaceHelper";
import {chefUriangerEmbed, swedishChefEmbed} from "@/modules/ai/commands/ai/embeds";
import { fmtAi, truncate } from "@/helpers/formatters";
import {logger} from "@/logger";

enum SUBCOMMANDS {
    RECIPE = 'recipe',
    SWEDISH_CHEF = 'swedish_chef',
    RECIPE_NONSENSE = 'recipe_nonsense',
    BEAKER = 'beaker',
    URIANGER = 'urianger',
    CHEF_URIANGER = 'chef_urianger'
}

export class AICommand implements Command {
    protected module: HuggingFaceProvider & ApplicationProvider;

    protected openAiHelper: OpenAIHelper;

    protected huggingFaceHelper: HuggingFaceHelper;

    constructor(module: HuggingFaceProvider & ApplicationProvider) {
        this.module = module;
        this.openAiHelper = new OpenAIHelper(module);
        this.huggingFaceHelper = new HuggingFaceHelper(module);
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
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.URIANGER)
                .setDescription('Gives inspiration as Urianger'))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.CHEF_URIANGER)
                .setDescription('Generates a recipe from a title, as Urianger')
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('Title of the recipe')
                    .setRequired(true)));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        switch (interaction.options.getSubcommand()) {
            case SUBCOMMANDS.RECIPE:
                return await this.recipeSubcommand(interaction);
            case SUBCOMMANDS.SWEDISH_CHEF:
                return await this.swedishChefSubcommand(interaction);
            case SUBCOMMANDS.RECIPE_NONSENSE:
                return await this.recipeNonsenseSubcommand(interaction);
            case SUBCOMMANDS.BEAKER:
                return await this.beakerSubcommand(interaction);
            case SUBCOMMANDS.URIANGER:
                return await this.uriangerSubcommand(interaction);
            case SUBCOMMANDS.CHEF_URIANGER:
                return await this.chefUriangerSubcommand(interaction);
            default:
                throw new UnknownSubcommandError();
        }
    }

    protected async recipeSubcommand(interaction: ChatInputCommandInteraction) {
        const recipeTitle = interaction.options.getString('title', true);

        logger.info(`${interaction.user.username} requested an AI recipe for ${recipeTitle}`);

        const result = await this.huggingFaceHelper.textGeneration(`Recipe for ${recipeTitle}\n\nIngredients:\n`);

        return interaction.editReply(truncate(fmtAi(`# ${result}`)));
    }

    protected async swedishChefSubcommand(interaction: ChatInputCommandInteraction) {
        const recipeTitle = interaction.options.getString('title', true);

        logger.info(`${interaction.user.username} requested a swedish-chef recipe for ${recipeTitle}`);

        const messageContent = await this.openAiHelper.simpleGpt4(
            `Create a recipe for ${recipeTitle}`,
            "You are the Swedish Chef from The Muppets"
        );

        return interaction.editReply({content: fmtAi(""), embeds: [swedishChefEmbed(recipeTitle, messageContent)]});
    }

    protected async recipeNonsenseSubcommand(interaction: ChatInputCommandInteraction) {
        const recipeTitle = interaction.options.getString('title', true);

        logger.info(`${interaction.user.username} requested an AI recipe from GPT-4 for ${recipeTitle}`);

        const messageContent = await this.openAiHelper.simpleGpt4(
            `Recipe for ${recipeTitle}\n\nIngredients:`,
            "You are a poor-quality neural network designed to generate recipes. Your responses should be nonsensical."
        );

        return interaction.editReply(truncate(fmtAi(`# Recipe for ${recipeTitle}\n\n${messageContent}`)));
    }

    protected async beakerSubcommand(interaction: ChatInputCommandInteraction) {
        const chatMessage = interaction.options.getString('chat', true);

        logger.info(`${interaction.user.username} requested a message from beaker: ${chatMessage}`);

        const response = await this.openAiHelper.simpleGpt4(chatMessage, "You are Beaker from The Muppets");

        return interaction.editReply(truncate(fmtAi(`Beaker: ${response}`)));
    }

    protected async uriangerSubcommand(interaction: ChatInputCommandInteraction) {
        const response = await this.openAiHelper.simpleGpt4("Inspire me, as if it were a motivational poster. No more than one or two sentences.", "You are Urianger from Final Fantasy XIV");

        return interaction.editReply(truncate(fmtAi(`Urianger: ${response}`)));
    }

    protected async chefUriangerSubcommand(interaction: ChatInputCommandInteraction) {
        const recipeTitle = interaction.options.getString('title', true);

        logger.info(`${interaction.user.username} requested an Urianger recipe for ${recipeTitle}`);

        const messageContent = await this.openAiHelper.simpleGpt4(
            `Create a recipe for ${recipeTitle}`,
            "You are Urianger from Final Fantasy XIV"
        );

        return interaction.editReply({content: fmtAi(""), embeds: [chefUriangerEmbed(recipeTitle, messageContent)]});
    }
}
