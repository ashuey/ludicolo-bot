import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { PriceSnipeEvent, TataruClient } from "@/modules/ffxiv/lib/tataru/TataruClient";
import { Application } from "@/common/Application";
import { logger } from "@/logger";
import { GuildAlertConfig } from "@/modules/ffxiv/alerts/GuildAlertConfig";

dayjs.extend(timezone);

// TODO: Don't hardcode
const alertChannels = ['1277359699703894046'];
const alertChannelsProd = ['1277776716772937799'];

const alertConfig: GuildAlertConfig = [
    { role: '1278481042251972689' }, // aether-all
    { role: '1278481076947521597', threshold: 10000 }, // aether-10k
    { role: '1278481178386497576', threshold: 100000 }, // aether-100k
    { role: '1278481216320045057', threshold: 1000000 }, // aether-1m
    { role: '1278481385526657064', threshold: Infinity }, // aether-unknown
    { role: '1278481241813024839', world: 'Gilgamesh' }, // gilgamesh-all
    { role: '1278481262599999498', world: 'Gilgamesh', threshold: 10000 }, // gilgamesh-10k
    { role: '1278481291133714472', world: 'Gilgamesh', threshold: 100000 }, // gilgamesh-100k
    { role: '1278481320330264656', world: 'Gilgamesh', threshold: 1000000 }, // gilgamesh-1m
    { role: '1278481354740203641', world: 'Gilgamesh', threshold: Infinity }, // gilgamesh-unknown
]

export class AlertsManager {
    static GilFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});

    static QuantityFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});

    static VelocityFormatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1});

    protected readonly app: Application;

    protected readonly tataru: TataruClient;

    constructor(app: Application) {
        this.app = app;
        this.tataru = new TataruClient(app.config.tataruApiKey);
        this.tataru.onAlert((e) => this.handle(e));
    }

    connect() {
        this.tataru.connect();
    }

    heartbeat() {
        this.tataru.heartbeat();
    }

    shutdown() {
        this.tataru.shutdown();
    }

    protected async handle(e: PriceSnipeEvent) {
        const hour = dayjs().tz("America/New_York").hour();

        if (hour >= 2 && hour < 10) {
            logger.debug("Currently between 2:00am and 10:00am. Not sending an alert.");
            return;
        }

        const channelsForAlert = this.app.isProduction ? alertChannelsProd : alertChannels;
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

            const netProfit = this.expectedProfit(e);

            if (netProfit >= (this.isHomeWorld(e) ? 1000 : 10000)) {
                const alertRoles = alertConfig.filter(c => {
                    if (c.world && c.world !== e.world) {
                        return false;
                    }

                    if (c.threshold && (netProfit < c.threshold)) {
                        return false;
                    }

                    if (netProfit === Infinity && c.threshold && (c.threshold !== Infinity)) {
                        return false;
                    }

                    return true;
                }).map(c => `<@&${c.role}>`).join(' ') + ' ';
                await channel.send({
                    content: alertRoles,
                    embeds: [this.buildEmbed(e, netProfit)],
                });
            } else {
                logger.debug(`Skipping alert for ${e.itemName}. Profitability too low (${netProfit}).`);
            }
        }
    }

    protected buildEmbed(e: PriceSnipeEvent, netProfit: number): EmbedBuilder {
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
                    name: "Gilgamesh Price",
                    value: `Min: ${
                        e.priceHome ? `${AlertsManager.GilFormatter.format(e.priceHome)} gil` : 'No Listings'
                    }\nAvg: ${
                        e.avgPriceHome ? `${AlertsManager.GilFormatter.format(e.avgPriceHome)} gil` : 'Unknown'
                    }`,
                    inline: true
                },
                {
                    name: "Price Delta",
                    value: `${AlertsManager.GilFormatter.format(e.previousPrice - e.price)} gil`,
                    inline: true
                },
                {
                    name: "Quantity",
                    value: AlertsManager.QuantityFormatter.format(e.quantity),
                    inline: true
                },
                {
                    name: "Estimated Profit",
                    value: netProfit === Infinity ? 'Unknown' : `${AlertsManager.GilFormatter.format(netProfit)} gil`,
                    inline: true
                },
                {
                    name: "Daily Sales Velocity",
                    value: `${AlertsManager.VelocityFormatter.format(e.velocity)} sales per day`,
                    inline: true
                },
            );
    }

    protected expectedProfit(e: PriceSnipeEvent) {
        let netProfit = Infinity;

        if (e.priceHome) {
            const listPrice = e.price * e.quantity
            const priceWithTax = listPrice + (0.05 * listPrice);
            const priceYouListAt = (e.priceHome - 1) * e.quantity;
            const sellerTax = priceYouListAt * 0.05;
            const saleProfit = priceYouListAt - sellerTax;
            netProfit = saleProfit - priceWithTax;
        }

        return netProfit;
    }

    protected isHomeWorld(e: PriceSnipeEvent) {
        return e.world === "Gilgamesh"
    }
}
