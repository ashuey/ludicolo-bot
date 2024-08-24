import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "@/common/Subcommand";
import { fmtWarning } from "@/helpers/formatters";

export class RemoveAlertCommand implements Subcommand {
    readonly name = "remove";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Remove an alert');
    }

    execute(interaction: ChatInputCommandInteraction): Promise<unknown> {
        return interaction.reply({ephemeral: true, content: fmtWarning("Command not yet implemented!")});
    }

}
