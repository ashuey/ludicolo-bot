import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "@/common/Subcommand";
import { fmtWarning } from "@/helpers/formatters";

export class AddUndercutAlertCommand implements Subcommand {
    readonly name = "add-undercut";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Adds an undercutting alert');
    }
    execute(interaction: ChatInputCommandInteraction): Promise<unknown> {
        return interaction.reply({ephemeral: true, content: fmtWarning("Command not yet implemented!")});
    }

}
