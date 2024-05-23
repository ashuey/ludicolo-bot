import {Subcommand} from "@/common/Subcommand";
import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";

export class ViewAutomodCommand implements Subcommand {
    protected readonly module: ServiceProvider;

    readonly name = 'view';

    constructor(module: ServiceProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('View current cleanup status for this channel.');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        return interaction.reply("ok");
    }

}
