import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "@/common/Command";
import { ApplicationProvider } from "@/common/ApplicationProvider";

export class AboutCommand implements Command {
    protected module: ApplicationProvider;

    constructor(module: ApplicationProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandBuilder())
            .setName('about')
            .setDescription('Information about the bot');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        let description = "https://github.com/ashuey/ludicolo-bot\n";
        const flyMachineVersion = process.env["FLY_MACHINE_VERSION"];
        const gitCommit = process.env["GIT_COMMIT"];

        description += "";

        if (flyMachineVersion) {
            description += `\nDeployment #${flyMachineVersion}.`;
        }

        if (gitCommit) {
            description += `\nCommit hash ${gitCommit}.`;
        }

        const embed = new EmbedBuilder()
            .setTitle("Ludicolo Bot v2")
            .setDescription(description)
            .addFields(
                {
                    name: "Enabled Modules",
                    value: this.module.app.modules.map(([name]) => name).join(", "),
                    inline: false
                },
            );

        return interaction.reply({
            ephemeral: true,
            embeds: [embed]
        });
    }
}
