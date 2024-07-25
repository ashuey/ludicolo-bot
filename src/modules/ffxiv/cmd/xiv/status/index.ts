import {Subcommand} from "@/common/Subcommand";
import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {getStatusData} from "@/modules/ffxiv/cmd/xiv/status/upstream";
import {fmtError} from "@/helpers/formatters";
import {StatusInformation} from "@/modules/ffxiv/cmd/xiv/status/StatusInformation";
import {buildStatusEmbed} from "@/modules/ffxiv/cmd/xiv/status/embed";

export class StatusCommand implements Subcommand {
    readonly name = 'status';

    constructor() {
    }

    build() {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Gets XIV server status information.')
    }

    async execute(interaction: ChatInputCommandInteraction) {
        let statusData: StatusInformation;

        try {
            statusData = await getStatusData();
        } catch {
            return interaction.reply(fmtError('Sorry, an error occurred while fetching status data'));
        }

        return interaction.reply({
            embeds: [buildStatusEmbed(statusData)]
        });
    }
}
