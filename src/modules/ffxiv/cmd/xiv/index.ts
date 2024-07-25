import {PluggableCommand} from "@/common/PluggableCommand";
import {SlashCommandBuilder} from "discord.js";
import {StatusCommand} from "@/modules/ffxiv/cmd/xiv/status";

export class XIVCommand extends PluggableCommand {
    constructor() {
        super();
        this.registerSubcommand(new StatusCommand());
    }

    buildRoot() {
        return (new SlashCommandBuilder())
            .setName('ff')
            .setDescription('Final Fantasy XIV-related commands');
    }
}
