import {SlashCommandSubcommandGroupBuilder} from "discord.js";
import {Subcommand} from "@/common/Subcommand";

export interface SubcommandGroup {
    name: string;

    subcommands: Subcommand[];

    build(): SlashCommandSubcommandGroupBuilder;
}
