import { RuntimeError } from "@/common/errors/RuntimeError";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export class OpenAIHelper {
    constructor(protected readonly module: ApplicationProvider) {}

    public async simpleGpt4(message: string, systemPrompt?: string): Promise<string> {
        const messages: Array<ChatCompletionMessageParam> = [];

        if (systemPrompt) {
            messages.push({ "role": "system", "content": systemPrompt });
        }

        messages.push({ "role": "user", "content": message });

        const response = await this.module.app.openai.chat.completions.create({
            model: "gpt-4",
            messages,
            temperature: 1,
            max_tokens: 1900,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const firstChoice = response.choices[0];

        if (!firstChoice) {
            throw new RuntimeError("Found ${response.choices.length} choices in response, expected 1", false);
        }

        const messageContent = firstChoice.message.content;

        if (!messageContent) {
            throw new RuntimeError("Message content is null", false);
        }

        return messageContent;
    }
}
