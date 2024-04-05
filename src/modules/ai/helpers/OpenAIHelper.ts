import { RuntimeError } from "@/common/errors/RuntimeError";
import { ApplicationProvider } from "@/common/ApplicationProvider";
import OpenAI from "openai";
import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import {GptRequestOptions} from "@/modules/ai/helpers/GptRequestOptions";

export class OpenAIHelper {
    constructor(protected readonly module: ApplicationProvider) {}

    public async simpleGpt4(message: string, systemPrompt?: string, options?: GptRequestOptions): Promise<string> {
        const messages: Array<ChatCompletionMessageParam> = [];

        if (systemPrompt) {
            messages.push({ "role": "system", "content": systemPrompt });
        }

        messages.push({ "role": "user", "content": message });

        const requestOptions = {
            model: "gpt-4",
            messages,
            temperature: 1,
            max_tokens: 1900,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            ...options,
        };

        const response = await this.module.app.openai.chat.completions.create(requestOptions);

        const firstChoice = response.choices[0];

        if (!firstChoice) {
            throw new RuntimeError(`Found ${response.choices.length} choices in response, expected 1`, false);
        }

        const messageContent = firstChoice.message.content;

        if (!messageContent) {
            throw new RuntimeError("Message content is null", false);
        }

        return messageContent;
    }

    public async simpleDallE3(prompt: string): Promise<string> {
        const response = await this.module.app.openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
        });

        const firstChoice = response.data[0];

        if (!firstChoice) {
            throw new RuntimeError(`Found ${response.data.length} choices in response, expected 1`, false);
        }

        if (!firstChoice.url) {
            throw new RuntimeError("Expected image URL in response, but got undefined", false);
        }

        return firstChoice.url;
    }
}
