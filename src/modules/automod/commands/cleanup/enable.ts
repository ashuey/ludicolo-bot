import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {format} from "@lukeed/ms";
import {Subcommand} from "@/common/Subcommand";
import {ServiceProvider} from "@/modules/automod/ServiceProvider";
import {GuildOnlyError} from "@/common/errors/GuildOnlyError";
import {fmtSuccess} from "@/helpers/formatters";
import {parseHumanSpan} from "@/helpers/parsers";

export class EnableCleanupAutomodCommand implements Subcommand {
    protected readonly module: ServiceProvider;

    readonly name = 'enable';

    constructor(module: ServiceProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Enable auto-cleanup in this channel.')
            .addStringOption(option => option
                .setName('age')
                .setDescription('Maximum age of messages to keep')
                .setRequired(true));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        const age = interaction.options.getString('age', true);
        const parsedAge = parseHumanSpan(age) * 1000;

        const created = await this.module.cleanup.enable(interaction.channelId, parsedAge);

        return interaction.reply({
            content: fmtSuccess(`${created
                ? 'Enabled auto-cleanup in this channel.'
                : 'Updated auto-cleanup settings.'
            } Messages older than ${format(parsedAge, true)} will be deleted`),
            ephemeral: true,
        });
    }

}
