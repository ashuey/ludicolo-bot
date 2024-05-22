import {Command} from "@/common/Command";
import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";

export interface Subcommand extends Pick<Command, 'execute'> {
    name: string;

    build(): SlashCommandSubcommandBuilder;

    execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
