import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type PartialSlashCommandBuilder = Pick<SlashCommandBuilder, 'name' | 'toJSON'>;

export interface Command {
    build(): PartialSlashCommandBuilder;

    execute(interaction: ChatInputCommandInteraction): Promise<unknown>;
}
