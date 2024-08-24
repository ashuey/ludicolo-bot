import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "@/common/Subcommand";
import { fmtWarning } from "@/helpers/formatters";

export class AddSnipeCommand implements Subcommand {
    readonly name = "add-snipe";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Adds a low price alert.')
    }
    execute(interaction: ChatInputCommandInteraction): Promise<unknown> {
        return interaction.reply({ephemeral: true, content: fmtWarning("Command not yet implemented!")});
    }

}
