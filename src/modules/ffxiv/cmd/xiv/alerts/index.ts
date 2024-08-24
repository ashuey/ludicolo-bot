import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { SubcommandGroup } from "@/common/SubcommandGroup";
import { Subcommand } from "@/common/Subcommand";
import { AddSnipeCommand } from "@/modules/ffxiv/cmd/xiv/alerts/add-snipe";
import { AddUndercutAlertCommand } from "@/modules/ffxiv/cmd/xiv/alerts/add-undercut";
import { ListAlertsCommand } from "@/modules/ffxiv/cmd/xiv/alerts/list";
import { RemoveAlertCommand } from "@/modules/ffxiv/cmd/xiv/alerts/remove";

export class AlertsSubcommandGroup implements SubcommandGroup {
    readonly name = "alerts"

    readonly subcommands: Subcommand[] = [
        new AddSnipeCommand(),
        new AddUndercutAlertCommand(),
        new ListAlertsCommand(),
        new RemoveAlertCommand(),
    ]

    build(): SlashCommandSubcommandGroupBuilder {
        return (new SlashCommandSubcommandGroupBuilder())
            .setDescription('Commands to manage marketboard alerts');
    }
}
