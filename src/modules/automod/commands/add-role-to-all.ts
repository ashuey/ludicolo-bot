import { ChatInputCommandInteraction, Guild, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "@/common/Command";
import { GuildOnlyError } from "@/common/errors/GuildOnlyError";

export class AddRoleToAllCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('add-role-to-all')
            .setDescription('Adds a role to all users in the server')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role to add')
                .setRequired(true));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        await interaction.deferReply();

        const role = interaction.options.getRole('role', true);
        const members = await (interaction.guild as Guild).members.list({
            limit: 1000
        });

        for (const member of members.values()) {
            await member.roles.add(role.id);
        }

        return interaction.editReply(`Added ${role.name} to ${members.size} members.`);
    }
}
