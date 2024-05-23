import {SubcommandGroup} from "@/common/SubcommandGroup";
import {SlashCommandSubcommandGroupBuilder} from "discord.js";
import {ViewAutomodCommand} from "@/modules/automod/commands/cleanup/view";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {Subcommand} from "@/common/Subcommand";

export class CleanupGroup implements SubcommandGroup {
    readonly name = "cleanup";

    readonly subcommands: Subcommand[] = [];

    constructor(module: ServiceProvider) {
        this.subcommands.push(new ViewAutomodCommand(module));
    }

    build() {
        return (new SlashCommandSubcommandGroupBuilder())
            .setDescription('Manage message cleanup')
    }

}
