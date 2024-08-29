import {SlashCommandBuilder} from "discord.js";
import {PluggableCommand} from "@/common/PluggableCommand";
import {StatusCommand} from "@/modules/ffxiv/cmd/xiv/status";
import { AlertsSubcommandGroup } from "@/modules/ffxiv/cmd/xiv/alerts";
import { CraftSimCommand } from "@/modules/ffxiv/cmd/xiv/craftsim";
import { ServiceProvider } from "@/modules/ffxiv/ServiceProvider";

export class XIVCommand extends PluggableCommand {
    constructor(module: ServiceProvider) {
        super();
        this.registerSubcommand(new CraftSimCommand(module))
        this.registerSubcommand(new StatusCommand());
        this.registerSubcommandGroup(new AlertsSubcommandGroup(module.alerts));
    }

    buildRoot() {
        return (new SlashCommandBuilder())
            .setName('ff')
            .setDescription('Final Fantasy XIV-related commands');
    }
}
