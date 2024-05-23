import {Subcommand} from "@/common/Subcommand";
import {bold, ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {GuildOnlyError} from "@/common/errors/GuildOnlyError";
import {fmtError, fmtSuccess} from "@/helpers/formatters";
import {format} from "@lukeed/ms";

export class ViewCleanupAutomodCommand implements Subcommand {
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
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        const currentStatus = await this.module.cleanup.get(interaction.channelId);

        if (!currentStatus) {
            return interaction.reply({
                content: fmtError("Auto-cleanup is not currently enabled in this channel."),
                ephemeral: true
            });
        }

        return interaction.reply({
            content: fmtSuccess(`Auto-cleanup is enabled in this channel.\n\n${bold('Maximum age:')} ${format(currentStatus.maximum_age)}`),
            ephemeral: true
        });
    }

}
