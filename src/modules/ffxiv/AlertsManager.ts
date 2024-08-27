import { EmbedBuilder } from "discord.js";
import { PriceSnipeEvent, TataruClient } from "@/modules/ffxiv/lib/tataru/TataruClient";
import { Application } from "@/common/Application";
import { logger } from "@/logger";

// TODO: Don't hardcode
const alertChannels = ['1277359699703894046'];
const alertChannelsProd = ['1277776716772937799'];
const alertChannelsGilgamesh = ['1277709841661689990'];
const alertChannelsGilgameshProd = ['1277776772364238938'];

export class AlertsManager {
    static GilFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});

    static QuantityFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});

    static VelocityFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1});

    protected readonly app: Application;

    protected readonly tataru: TataruClient;

    protected active = false;

    constructor(app: Application) {
        this.app = app;
        this.tataru = new TataruClient(app.config.tataruApiKey);
        this.tataru.onAlert((e) => this.handle(e));
    }

    connect() {
        this.active = true;
        this.tataru.connect();
    }

    refresh() {
        if (this.active) {
            this.tataru.refresh();
        }
    }

    protected async handle(e: PriceSnipeEvent) {
        const channelsForAlert = this.app.isProduction ?
            // TODO: Don't hardcode Gilgamesh check
            (e.world === "Gilgamesh" ? [...alertChannelsProd, ...alertChannelsGilgameshProd] : [...alertChannelsProd])
            : (e.world === "Gilgamesh" ? [...alertChannels, ...alertChannelsGilgamesh] : [...alertChannels]);
        for (const channelId of channelsForAlert) {
            const channel = await this.app.discord.channels.fetch(channelId);

            if (!channel) {
                logger.warn(`Channel for XIV Alerts was not found: ${channelId}`);
                continue;
            }

            if (!channel.isTextBased()) {
                logger.warn(`Channel for XIV Alerts is not text-based: ${channel.name}`);
                continue;
            }

            await channel.send({
                embeds: [this.buildEmbed(e)],
            })
        }
    }

    protected buildEmbed(e: PriceSnipeEvent): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(`Price Snipe Alert: ${e.itemName} (${e.hq ? 'HQ' : 'NQ'})`)
            .setDescription(`🌎 ${e.world}`)
            .setColor(e.world === "Gilgamesh" ? "#2ecc71" : "#f1c40f")
            .addFields(
                {
                    name: "Previous Price",
                    value: `${AlertsManager.GilFormatter.format(e.previousPrice)} gil`,
                    inline: true
                },
                {
                    name: "New Price",
                    value: `${AlertsManager.GilFormatter.format(e.price)} gil`,
                    inline: true
                },
                {
                    name: "Price Delta",
                    value: `${AlertsManager.GilFormatter.format(e.previousPrice - e.price)} gil`,
                    inline: false
                },
                {
                    name: "Quantity",
                    value: AlertsManager.QuantityFormatter.format(e.quantity),
                    inline: false
                },
                {
                    name: "Daily Sales Velocity",
                    value: `${AlertsManager.VelocityFormatter.format(e.velocity)} sales per day`,
                    inline: false
                },
            );
    }
}
