import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {Command} from "@/common/Command";

export interface Subcommand extends Pick<Command, 'execute'> {
    readonly name: string;

    build(): SlashCommandSubcommandBuilder;

    execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
