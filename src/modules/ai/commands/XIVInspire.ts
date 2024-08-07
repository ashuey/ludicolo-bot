import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import axios from "axios";
import {Command} from "@/common/Command";
import {OpenAIHelper} from "@/modules/ai/helpers/OpenAIHelper";
import {ApplicationProvider} from "@/common/ApplicationProvider";
import {composeInspirationImage} from "@/modules/ai/helpers/composeImage";
import {logger} from "@/logger";

const userPrompts = [
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me',
    'inspire me with something completely insane. Like "the elezens faked the moon landing" kind of insane'
]

export function getUserPrompt(): string {
    return userPrompts[Math.floor(Math.random() * userPrompts.length)] as string;
}

export class XIVInspire implements Command {
    protected static readonly FONT_DIR = "";

    protected module: ApplicationProvider;

    protected openAiHelper: OpenAIHelper;

    constructor(module: ApplicationProvider) {
        this.module = module;
        this.openAiHelper = new OpenAIHelper(module);
    }

    build() {
        return (new SlashCommandBuilder())
            .setName('ffinspire')
            .setDescription('Generates FFXIV-themed inspiration')
    }

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        logger.info(`${interaction.user.username} requested FFXIV inspiration`);

        const userPrompt = getUserPrompt();

        logger.debug(`UserPrompt> ${userPrompt}`);

        const result = await this.openAiHelper.simpleGpt4(
            userPrompt,
            "As the Eorzean Satirist, your task is to create concise, single-sentence humorous and occasionally cheeky motivational messages inspired by Final Fantasy XIV. Your responses should encapsulate the spirit of whimsy and absurdity inherent in satire, all while remaining grounded in FFXIV's lore and language. Keep your messages brief, aiming for impact and amusement in just one sentence. Whether it's a quirky take on Eorzean life or a playful jab at the game's mechanics, your goal is to spark laughter and delight in a succinct and witty manner.",
            {
                temperature: 1.05,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }
        );

        logger.debug(`ChatGPT> ${result}`);

        const cleanedInspiration = this.cleanResult(result);

        logger.debug(`Cleaned> ${cleanedInspiration}`);

        const buffer = await this.getBackgroundImage(cleanedInspiration);

        const inspirationImage = await composeInspirationImage(buffer, cleanedInspiration);

        return interaction.editReply({
            files: [{
                attachment: inspirationImage,
                name: "inspiration.png"
            }]
        });
    }

    private async getBackgroundImage(prompt: string): Promise<Buffer> {
        const imgUrl = await this.openAiHelper.simpleDallE3(`Create a background for this "inspirational" text. DO NOT include ANY text in the image, only use it as a guide. ABSOLUTELY NO TEXT IN THE GENERATED IMAGE. NO LETTERS AT ALL. The text is: ${prompt}`);

        const response = await axios.get(imgUrl, {responseType: 'arraybuffer'})
        return Buffer.from(response.data, "utf-8");
    }

    private cleanResult(result: string) {
        const withReplacements = result
            .trim()
            // Remove quotes
            .replace(/^"(.*)"$/, "$1")
            // Remove "just remember folks, "
            .replace(/^just remember folks,\s/, "")
            // Remove "remember, "
            .replace(/^remember,\s/i, "");

        return withReplacements.charAt(0).toUpperCase() + withReplacements.slice(1);
    }
}
