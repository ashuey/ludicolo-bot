import { Command } from "@/common/Command";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mustGetGuild } from "@/helpers/commands";
import { MinecraftConfigProvider } from "@/modules/minecraft/MinecraftConfigProvider";
import { WhitelistrProvider } from "@/modules/minecraft/WhitelistrProvider";
import { fmtError, fmtSuccess } from "@/helpers/formatters";
import { mojang } from "@/modules/minecraft/apis/mojang";

type MinecraftModule = MinecraftConfigProvider & WhitelistrProvider;

export class MinecraftCommand implements Command {
    static readonly USERNAME_REGEX = /^\w+$/i;

    protected readonly module: MinecraftModule;

    constructor(module: MinecraftModule) {
        this.module = module;
    }
    build() {
        return (new SlashCommandBuilder())
            .setName('minecraft')
            .setDescription('Various Minecraft related commands')
            .addSubcommand(cmd => cmd
                .setName('join')
                .setDescription('Join the Minecraft server')
                .addStringOption(option =>
                    option.setName('username')
                        .setDescription('Minecraft username')
                        .setRequired(true)
                        .setMinLength(3)
                        .setMaxLength(16)));
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const guild = mustGetGuild(interaction);
        const user = interaction.user;
        const minecraftUsername = interaction.options.getString('username', true);

        // TODO: Properly handle command branching

        // TODO: Actually just register this command in approved guilds
        if (guild.id !== this.module.approvedGuild) {
            console.log(`${user.username} tried to use /whitelist in unapproved guild: ${guild.name} (ID: ${guild.id}`);
            return interaction.reply({
                content: fmtError("Sorry, this command is not available here"),
                ephemeral: true,
            })
        }

        if (!MinecraftCommand.USERNAME_REGEX.test(minecraftUsername)) {
            console.log(`${user.username} tried to whitelist invalid username: ${minecraftUsername}`);
            return interaction.reply({
                content: fmtError("Invalid username"),
                ephemeral: true,
            })
        }

        const [result, validErr] = await mojang.validateUsername(minecraftUsername);

        if (!result) {
            console.log(`Internal error validating MC username: ${user.username} tried to whitelist ${minecraftUsername}. Error: ${validErr}`);
            return interaction.reply({
                content: fmtError("An internal error occurred while validating your information. Please try again."),
                ephemeral: true,
            });
        }

        if (!validErr) {
            console.log(`${user.username} tried whitelist username, which failed validation: ${minecraftUsername}`);
            return interaction.reply({
                content: fmtError("That username does not exist. If you believe this is an error, please contact an administrator"),
                ephemeral: true,
            })
        }

        const [wlResult, wlError] = await this.module.whitelistr.whitelistUser(minecraftUsername);

        if (!wlResult) {
            console.log(`Internal error whitelisting user: ${user.username} tried to whitelist ${minecraftUsername}. Error: ${wlError}`);
            return interaction.reply({
                content: fmtError("An internal error occurred while adding you to the server. Please try again."),
                ephemeral: true,
            });
        }

        console.log(`${user.username} added ${minecraftUsername} to the Minecraft whitelist`);
        return interaction.reply({
            content: fmtSuccess(`Added ${minecraftUsername} to the Minecraft server.\n\nConnect to the server at \`${this.module.minecraftServer}\``),
            ephemeral: true,
        });
    }
}
