import {SlashCommandSubcommandGroupBuilder} from "discord.js";
import {SubcommandGroup} from "@/common/SubcommandGroup";
import {ViewCleanupAutomodCommand} from "@/modules/automod/commands/cleanup/view";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {Subcommand} from "@/common/Subcommand";
import {EnableCleanupAutomodCommand} from "@/modules/automod/commands/cleanup/enable";
import {DisableCleanupAutomodCommand} from "@/modules/automod/commands/cleanup/disable";

export class CleanupGroup implements SubcommandGroup {
    readonly name = "cleanup";

    readonly subcommands: Subcommand[] = [];

    constructor(module: ServiceProvider) {
        this.subcommands.push(new EnableCleanupAutomodCommand(module));
        this.subcommands.push(new DisableCleanupAutomodCommand(module));
        this.subcommands.push(new ViewCleanupAutomodCommand(module));
    }

    build() {
        return (new SlashCommandSubcommandGroupBuilder())
            .setDescription('Manage message cleanup')
    }

}
