import { ChatInputCommandInteraction, Guild } from "discord.js";
import { RuntimeError } from "@/common/RuntimeError";

export function mustGetGuild(interaction: ChatInputCommandInteraction): Guild {
    const guild = interaction.guild;

    if (!guild) {
        throw new RuntimeError("This command must be run in a guild");
    }

    return guild;
}
