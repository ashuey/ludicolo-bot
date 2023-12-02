import { MessageComponentInteraction } from "discord.js";

export interface ComponentHandler {
    handle(interaction: MessageComponentInteraction): Promise<unknown>
}
