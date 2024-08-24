import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Subcommand } from "@/common/Subcommand";
import { fmtWarning } from "@/helpers/formatters";

export class ListAlertsCommand implements Subcommand {
    readonly name = "list";

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Lists alerts you currently have set up');
    }
    execute(interaction: ChatInputCommandInteraction): Promise<unknown> {
        return interaction.reply({ephemeral: true, content: fmtWarning("Command not yet implemented!")});
    }

}
