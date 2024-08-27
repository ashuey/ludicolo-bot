import { Configuration } from "@/config/Configuration";

function envOrThrow(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

export function getConfig(): Readonly<Configuration> {
    return Object.freeze({
        env: process.env['NODE_ENV'] ?? '',
        discordToken: envOrThrow('DISCORD_TOKEN'),
        discordApplicationId: envOrThrow('DISCORD_APPLICATION_ID'),
        airNowApiKey: envOrThrow('AIR_NOW_API_KEY'),
        openAiApiKey: envOrThrow('OPENAI_API_KEY'),
        databasePath: envOrThrow('DATABASE_PATH'),
        tataruApiKey: envOrThrow('TATARU_API_KEY'),
    });
}
