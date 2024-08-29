import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { WebSocket } from "ws";
import { Subcommand } from "@/common/Subcommand";
import { AlertsManager } from "@/modules/ffxiv/alerts/AlertsManager";

function formatDate(timestamp: number) {
    if (timestamp === 0) {
        return "never";
    }
    const seconds = Math.floor((timestamp / 1000));
    return `<t:${seconds}:T> (<t:${seconds}:R>)`;
}

export class DebugAlertsCommand implements Subcommand {
    readonly name = "debug";

    protected readonly alertsManager: AlertsManager;

    constructor(alertsManager: AlertsManager) {
        this.alertsManager = alertsManager;
    }

    build(): SlashCommandSubcommandBuilder {
        return (new SlashCommandSubcommandBuilder())
            .setDescription('Debug information about the alert server connection');
    }
    execute(interaction: ChatInputCommandInteraction) {
        const debugInfo = this.alertsManager.debug();
        let readyState = "UNKNOWN";

        switch (debugInfo.readyState) {
            case WebSocket.CONNECTING:
                readyState = "CONNECTING";
                break;
            case WebSocket.OPEN:
                readyState = "OPEN";
                break;
            case WebSocket.CLOSING:
                readyState = "CLOSING";
                break;
            case WebSocket.CLOSED:
                readyState = "CLOSED";
                break;
        }

        const embed = new EmbedBuilder()
            .setTitle("XIV Alerts Debug Information")
            .setDescription(`Current State: ${readyState}` +
                `\nLast Message: ${formatDate(debugInfo.lastMessage)}` +
                `\nLast Alert: ${formatDate(debugInfo.lastAlert)}` +
                `\nLast Connection Attempt: ${formatDate(debugInfo.lastConnectionAttempt)}` +
                `\n\nLast Error: ${debugInfo.lastError ?? 'None'}`);

        return interaction.reply({ embeds: [embed] });
    }

}
