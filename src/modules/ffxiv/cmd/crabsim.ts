import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageComponentInteraction,
    SlashCommandBuilder
} from "discord.js";
import {Command} from "@/common/Command";
import {GuildOnlyError} from "@/common/errors/GuildOnlyError";
import {fmtError} from "@/helpers/formatters";
import {ComponentHandler} from "@/common/ComponentHandler";
import {logger} from "@/logger";

const ringChance = 0.02;
const crabMaxHealth = 100
let crabLock = false;
let crabHealth = crabMaxHealth;
const crabHits = new Set<string>();

const deadEmbed = new EmbedBuilder()
    .setTitle("FATE: Morte Arthro")
    .setDescription(`${"░".repeat(20)} 0%\n\n🪦 Dead`)

function getEmbed(health: number) {
    const realHealth = Math.min(Math.max(0, health), crabMaxHealth);
    const fullHpBars = Math.round(realHealth / 5);
    const emptyHpBars = 20 - fullHpBars;
    const healthBar = `${"█".repeat(fullHpBars)}${"░".repeat(emptyHpBars)} ${Math.round(realHealth)}%`;
    return new EmbedBuilder()
        .setTitle("FATE: Morte Arthro")
        .setDescription(healthBar)
        .setImage("https://pbs.twimg.com/media/D0_NeCTVAAEfFQI.jpg");
}

async function endFate(interval: NodeJS.Timeout, interaction: ChatInputCommandInteraction) {
    clearInterval(interval);

    const dropMessages = [...crabHits.values()].map(userId => (
        `<@${userId}> got ${Math.random() < ringChance
            ? '6 Pagos Lockboxes, 24 Pagos Crystals and a Blitzring'
            : '6 Pagos Lockboxes and 24 Pagos Crystals'
        }`
    ))

    crabHits.clear();
    crabHealth = crabMaxHealth;
    crabLock = false;

    await interaction.editReply({
        embeds: [deadEmbed],
        components: [],
    })

    if (dropMessages.length > 0) {
        await (new Promise(resolve => setTimeout(resolve, 1000)));

        await interaction.followUp(dropMessages.join("\n"));
    }
}

export class CrabSimCommand implements Command {
    build() {
        return (new SlashCommandBuilder())
            .setName('crab-sim')
            .setDescription('Simulates Crab');
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            throw new GuildOnlyError();
        }

        if (crabLock) {
            return interaction.reply({
                content: fmtError("Can't' spawn crab right now."),
                ephemeral: true
            });
        }

        crabLock = true;

        const hitButton = new ButtonBuilder()
            .setCustomId('com://ffxiv/hit_crab')
            .setLabel('Hit Crab')
            .setEmoji('⚔️')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(hitButton);

        await interaction.reply({
            embeds: [getEmbed(crabHealth)],
            components: [row]
        });

        const healthInterval = setInterval(() => {
            const healthLoss = Math.floor(Math.random() * (16)) + 5;
            crabHealth -= healthLoss;
            if (crabHealth < 0) {
                endFate(healthInterval, interaction);
            } else {
                interaction.editReply({
                    embeds: [getEmbed(crabHealth)],
                });
            }
        }, 1250);

        return;
    }
}

export class CrabHitHandler implements ComponentHandler {
    async handle(interaction: MessageComponentInteraction) {
        logger.debug(`${interaction.user.username} hits the crab`);
        crabHits.add(interaction.user.id);
        await interaction.deferUpdate();
    }
}
