import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "@/common/Command";
import {UnknownSubcommandError} from "@/common/errors/UnknownSubcommandError";
import {ApplicationProvider} from "@/common/ApplicationProvider";
import {OpenAIHelper} from "@/modules/ai/helpers/OpenAIHelper";
import {chefUriangerEmbed, swedishChefEmbed} from "@/modules/ai/commands/ai/embeds";
import {fmtAi, truncate} from "@/helpers/formatters";
import {logger} from "@/logger";
import {badWritingInputs} from "@/modules/ai/commands/ai/badWritingInputs";

enum SUBCOMMANDS {
    RECIPE = 'recipe',
    SWEDISH_CHEF = 'swedish_chef',
    BEAKER = 'beaker',
    URIANGER = 'urianger',
    CHEF_URIANGER = 'chef_urianger',
    BAD_WRITING = 'bad_writing',
    IMAGE = 'image',
    IMAGE_LEGACY = 'image_legacy',
}

export class AICommand implements Command {
    protected module: ApplicationProvider;

    protected openAiHelper: OpenAIHelper;

    constructor(module: ApplicationProvider) {
        this.module = module;
        this.openAiHelper = new OpenAIHelper(module);
    }

    build() {
        return (new SlashCommandBuilder())
            .setName('ai')
            .setDescription('Generates (usually low-quality) AI responses')
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.BAD_WRITING)
                .setDescription('Generates an atrocious opening sentence to the worst novel never written'))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.SWEDISH_CHEF)
                .setDescription('Generates a recipe from a title, as the swedish chef')
                .addStringOption(option => option
                    .setName('title')
                    .setDescription('Title of the recipe')
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.RECIPE)
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
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.IMAGE_LEGACY)
                .setDescription('Generates an image with Dall-E 2')
                .addStringOption(option => option
                    .setName('prompt')
                    .setDescription('Image prompt')
                    .setRequired(true)))
            .addSubcommand(cmd => cmd
                .setName(SUBCOMMANDS.IMAGE)
                .setDescription('Generates an image')
                .addStringOption(option => option
                    .setName('prompt')
                    .setDescription('Image prompt')
                    .setRequired(true)));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        switch (interaction.options.getSubcommand()) {
            case SUBCOMMANDS.BAD_WRITING:
                return await this.badWritingSubcommand(interaction);
            case SUBCOMMANDS.SWEDISH_CHEF:
                return await this.swedishChefSubcommand(interaction);
            case SUBCOMMANDS.RECIPE:
                return await this.recipeSubcommand(interaction);
            case SUBCOMMANDS.BEAKER:
                return await this.beakerSubcommand(interaction);
            case SUBCOMMANDS.URIANGER:
                return await this.uriangerSubcommand(interaction);
            case SUBCOMMANDS.CHEF_URIANGER:
                return await this.chefUriangerSubcommand(interaction);
            case SUBCOMMANDS.IMAGE_LEGACY:
                return await this.imageLegacySubcommand(interaction);
            case SUBCOMMANDS.IMAGE:
                return await this.imageSubcommand(interaction);
            default:
                throw new UnknownSubcommandError();
        }
    }

    protected async badWritingSubcommand(interaction: ChatInputCommandInteraction) {
        const result = await this.openAiHelper.simpleGpt4(
            badWritingInputs.join("\n"),
            'WRITE MORE SENTENCES LIKE THESE',
            {
                model: "gpt-3.5-turbo",
                temperature: 1.17,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.88,
            }
        )

        const resultStr = result.split('\n')[0] ?? '';

        return interaction.editReply(truncate(fmtAi(resultStr)));
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

    protected async recipeSubcommand(interaction: ChatInputCommandInteraction) {
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

    protected async imageLegacySubcommand(interaction: ChatInputCommandInteraction) {
        const prompt = interaction.options.getString('prompt', true);

        const images = await this.openAiHelper.simpleDallE2(prompt);

        return interaction.editReply({
            content: fmtAi(`Prompt: ${prompt}`),
            files: images.map((imgUrl, idx) => ({
                attachment: imgUrl,
                name: `image${idx}.png`
            }))
        })
    }

    protected async imageSubcommand(interaction: ChatInputCommandInteraction) {
        const prompt = interaction.options.getString('prompt', true);

        const imgUrl = await this.openAiHelper.simpleDallE3(`Draw this: ${prompt}`);

        return interaction.editReply({
            content: fmtAi(`Prompt: ${prompt}`),
            files: [{
                attachment: imgUrl,
                name: "inspiration.png"
            }]
        })
    }
}
