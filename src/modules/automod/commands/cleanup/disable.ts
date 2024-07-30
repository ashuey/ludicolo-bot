import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {Subcommand} from "@/common/Subcommand";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {GuildOnlyError} from "@/common/errors/GuildOnlyError";
import {fmtSuccess} from "@/helpers/formatters";

export class DisableCleanupAutomodCommand implements Subcommand {
    protected readonly module: ServiceProvider;

    readonly name = 'disable';

    constructor(module: ServiceProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Disable auto-cleanup in this channel.');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        await this.module.cleanup.disable(interaction.channelId);

        return interaction.reply({
            content: fmtSuccess('Disabled auto-cleanup in this channel.'),
            ephemeral: true,
        });
    }

}
