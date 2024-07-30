import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "@/common/Command";
import {Subcommand} from "@/common/Subcommand";
import {SubcommandGroup} from "@/common/SubcommandGroup";
import {SubcommandGroupRegistration} from "@/common/SubcommandGroupRegistration";
import {UnknownSubcommandError} from "@/common/errors/UnknownSubcommandError";

export abstract class PluggableCommand implements Command {
    protected subcommandGroups = new Map<string, SubcommandGroupRegistration>();
    protected subcommands = new Map<string, Subcommand>();

    protected registerSubcommand(subcommand: Subcommand): this {
        this.subcommands.set(subcommand.name, subcommand);

        return this;
    }

    protected registerSubcommandGroup(subcommandGroup: SubcommandGroup): this {
        const subcommands = new Map<string, Subcommand>();

        subcommandGroup.subcommands.forEach((subcommand: Subcommand) => {
            subcommands.set(subcommand.name, subcommand);
        })

        this.subcommandGroups.set(subcommandGroup.name, {
            subcommandGroup,
            subcommands,
        });

        return this;
    }

    abstract buildRoot(): SlashCommandBuilder;

    build() {
        const root = this.buildRoot();

        this.subcommandGroups.forEach(registration => {
            const builder = registration.subcommandGroup.build().setName(registration.subcommandGroup.name);

            registration.subcommands.forEach((subcommand: Subcommand) => {
                builder.addSubcommand(subcommand.build().setName(subcommand.name));
            })

            root.addSubcommandGroup(builder);
        });

        this.subcommands.forEach(subcommand => {
            root.addSubcommand(subcommand.build().setName(subcommand.name));
        })

        return root;
    }

    async execute(interaction: ChatInputCommandInteraction) {
        let subcommands: Map<string, Subcommand> = this.subcommands;
        const subcommandGroup = interaction.options.getSubcommandGroup();

        if (subcommandGroup) {
            const subcommandGroupRegistration = this.subcommandGroups.get(subcommandGroup);

            if (!subcommandGroupRegistration) {
                throw new UnknownSubcommandError();
            }

            subcommands = subcommandGroupRegistration.subcommands;
        }

        const subcommand = interaction.options.getSubcommand();

        const matchedSubcommand = subcommands.get(subcommand);

        if (!matchedSubcommand) {
            throw new UnknownSubcommandError();
        }

        return matchedSubcommand.execute(interaction)
    }
}
