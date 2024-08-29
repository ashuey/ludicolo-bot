import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { SubcommandGroup } from "@/common/SubcommandGroup";
import { Subcommand } from "@/common/Subcommand";
// import { AddSnipeCommand } from "@/modules/ffxiv/cmd/xiv/alerts/add-snipe";
// import { AddUndercutAlertCommand } from "@/modules/ffxiv/cmd/xiv/alerts/add-undercut";
// import { ListAlertsCommand } from "@/modules/ffxiv/cmd/xiv/alerts/list";
// import { RemoveAlertCommand } from "@/modules/ffxiv/cmd/xiv/alerts/remove";
import { DebugAlertsCommand } from "@/modules/ffxiv/cmd/xiv/alerts/debug";
import { AlertsManager } from "@/modules/ffxiv/alerts/AlertsManager";

export class AlertsSubcommandGroup implements SubcommandGroup {
    readonly name = "alerts"

    readonly subcommands: Subcommand[];

    constructor(alertsManager: AlertsManager) {
        this.subcommands = [
            //new AddSnipeCommand(),
            //new AddUndercutAlertCommand(),
            //new ListAlertsCommand(),
            //new RemoveAlertCommand(),
            new DebugAlertsCommand(alertsManager),
        ];
    }

    build(): SlashCommandSubcommandGroupBuilder {
        return (new SlashCommandSubcommandGroupBuilder())
            .setDescription('Commands to manage marketboard alerts');
    }
}
