import { ComponentHandler } from "@/common/ComponentHandler";
import { MessageComponentInteraction } from "discord.js";
import { ApplicationProvider } from "@/common/ApplicationProvider";

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

        const [, , response] = await Promise.all([
            interaction.message.edit({components: []}),
            interaction.deferReply(),
            this.module.app.openai.images.generate({
                model: "dall-e-2",
                prompt,
                n: 1,
                size: "1024x1024",
            })
        ]);


        const dataObj = response.data[0];

        if (!dataObj || !dataObj.url) {
            return interaction.editReply("Sorry, something went wrong");
        }

        return interaction.editReply({
            files: [{
                attachment: dataObj.url,
                name: "ai_drawing.png"
            }]
        });
    }
}
