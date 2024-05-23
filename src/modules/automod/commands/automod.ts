import {PluggableCommand} from "@/common/PluggableCommand";
import {SlashCommandBuilder, PermissionFlagsBits} from "discord.js";
import {CleanupGroup} from "@/modules/automod/commands/cleanup";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";

export class AutomodCommand extends PluggableCommand {
    constructor(module: ServiceProvider) {
        super();
        this.registerSubcommandGroup(new CleanupGroup(module));
    }
    buildRoot() {
        return (new SlashCommandBuilder())
            .setName('automod')
            .setDescription('Manage auto moderator settings')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
}
