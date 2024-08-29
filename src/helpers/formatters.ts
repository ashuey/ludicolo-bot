import { EmbedBuilder } from "discord.js";

export function fmtError(msg: string): string {
    return `❌ ${msg}`;
}

export function fmtErrorEmbed(msg: string) {
    return (new EmbedBuilder())
        .setTitle("ERROR")
        .setDescription(msg)
        .setColor("#ff0000");
}

export function fmtWarning(msg: string): string {
    return `⚠️ ${msg}`;
}

export function fmtSuccess(msg: string): string {
    return `✅ ${msg}`;
}

export function fmtAi(msg: string): string {
    return `🤖 __**This content is AI-Generated**__ 🤖\n\n${msg}`;
}

export function truncate(msg: string): string {
    return msg.length > 2000 ? msg.substring(0, 2000) : msg;
}
