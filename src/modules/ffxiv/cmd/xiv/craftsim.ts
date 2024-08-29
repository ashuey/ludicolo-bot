import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "@/common/Subcommand";
import { ServiceProvider } from "@/modules/ffxiv/ServiceProvider";
import { CraftMarketSim } from "@/modules/ffxiv/crafting/craftsim/CraftMarketSim";

export class CraftSimCommand implements Subcommand {
    readonly name = 'craftsim';

    protected readonly module: ServiceProvider;

    constructor(module: ServiceProvider) {
        this.module = module;
    }

    build() {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Gets the top craftable items for profit.')
    }

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const sim = new CraftMarketSim(this.module.app.cache, this.module.alerts.tataru.REST);
        const result = await sim.craftsim();
        const gilFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});


        const embed = new EmbedBuilder()
            .setTitle("Craft Simulation Results")
            .setDescription(
                result.slice(0, 10)
                    .map(([itemName, profit]) => `${itemName} - ${gilFormatter.format(profit)} gil`)
                    .join("\n")
            );

        await interaction.editReply({ embeds: [embed] });
    }
}
