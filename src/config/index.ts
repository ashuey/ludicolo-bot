import * as dotenv from "dotenv";
import { Configuration } from "@/config/Configuration";

dotenv.config();

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
    dbUrl: '', // envOrThrow('DATABASE_URL'),
    airNowApiKey: envOrThrow('AIR_NOW_API_KEY'),
    minecraftGuild: envOrThrow('MINECRAFT_GUILD'),
    minecraftServer: envOrThrow('MINECRAFT_SERVER'),
    whitelistrEndpoint: envOrThrow('WHITELISTR_ENDPOINT'),
    whitelistrKey: envOrThrow('WHITELISTR_KEY'),
});
