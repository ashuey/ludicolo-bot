import { Configuration } from "@/config/Configuration";

function envOrThrow(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

export const config: Readonly<Configuration> = Object.freeze({
    discordToken: envOrThrow('DISCORD_TOKEN'),
    discordApplicationId: envOrThrow('DISCORD_APPLICATION_ID'),
    airNowApiKey: envOrThrow('AIR_NOW_API_KEY'),
    openAiApiKey: envOrThrow('OPENAI_API_KEY'),
    huggingFaceApiKey: envOrThrow('HUGGING_FACE_API_KEY'),
    pocketBaseUrl: envOrThrow('POCKET_BASE_URL'),
    pocketBaseUsername: envOrThrow('POCKET_BASE_USERNAME'),
    pocketBasePassword: envOrThrow('POCKET_BASE_PASSWORD'),
});
