import {SlashCommandBuilder} from "discord.js";
import {PluggableCommand} from "@/common/PluggableCommand";
import {StatusCommand} from "@/modules/ffxiv/cmd/xiv/status";
// import { AlertsSubcommandGroup } from "@/modules/ffxiv/cmd/xiv/alerts";

export class XIVCommand extends PluggableCommand {
    constructor() {
        super();
        this.registerSubcommand(new StatusCommand());
        //this.registerSubcommandGroup(new AlertsSubcommandGroup());
    }

    buildRoot() {
        return (new SlashCommandBuilder())
            .setName('ff')
            .setDescription('Final Fantasy XIV-related commands');
    }
}
