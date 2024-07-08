import { ComponentHandler } from "@/common/ComponentHandler";
import { MessageComponentInteraction } from "discord.js";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import { APIError } from "openai";
import { fmtError } from "@/helpers/formatters";
import {logger} from "@/logger";

const POLICY_VIOLATION_ERROR = "content_policy_violation";

const artPromptRegex = /^Art Prompt: (.*)/;
const noCanDoMsg = "Sorry, I don't think I can draw that.";

export class DrawPromptHandler implements ComponentHandler {
    protected module: ApplicationProvider;

    constructor(module: ApplicationProvider) {
        this.module = module;
    }

    async handle(interaction: MessageComponentInteraction) {
        // Get the user who originally requested the art prompt
        const originalUser = interaction.message.interaction?.user;

        if (!originalUser || !interaction.user.equals(originalUser)) {
            return interaction.reply({
                ephemeral: true,
                content: "Sorry, only the person who requested the art prompt can request a drawing"
            });
        }

        const messageMatch = artPromptRegex.exec(interaction.message.content);

        if (!messageMatch) {
            return interaction.reply(noCanDoMsg);
        }

        const prompt = messageMatch[1];

        if (!prompt) {
            return interaction.reply(noCanDoMsg);
        }

        logger.info(`Drawing '${prompt}' for ${interaction.user.username}`);

        await Promise.all([
            interaction.message.edit({components: []}),
            interaction.deferReply(),
        ]);

        let dataObj;

        try {
            const response = await this.module.app.openai.images.generate({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
            });

            dataObj = response.data[0];
        } catch (e) {
            if (!(e instanceof APIError)) {
                throw e;
            }

            logger.error(`Open AI error: ${e}`);

            switch (e.code) {
                case POLICY_VIOLATION_ERROR:
                    return interaction.editReply(fmtError("Sorry, that prompt was rejected as a result of Open AI's safety system"));
                default:
                    return interaction.editReply(fmtError("Sorry, something went wrong"));
            }
        }

        if (!dataObj || !dataObj.url) {
            return interaction.editReply(fmtError("Sorry, something went wrong"));
        }

        return interaction.editReply({
            files: [{
                attachment: dataObj.url,
                name: "ai_drawing.png"
            }]
        });
    }
}
