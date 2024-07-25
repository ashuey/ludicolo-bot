import {Dc, Global, Region, Server, StatusInformation} from "@/modules/ffxiv/cmd/xiv/status/StatusInformation";
import {EmbedBuilder} from "discord.js";

export function buildStatusEmbed(data: StatusInformation) {
    return new EmbedBuilder()
        .setTitle("FFXIV Server Status")
        .addFields(globalField(data.Global))
        .addFields(regionFields(data.NARegion));
}

function globalField(data: Global) {
    return {
        name: "Global Services",
        // eslint-disable-next-line no-irregular-whitespace
        value: `${emoji(data.LoginServerStatus)} Login Server\n${emoji(data.GateServerStatus)} Gate Server`,
        inline: false
    }
}

function regionFields(data: Region) {
    return data.DCs.map(dc => ({
        name: dc.Name,
        value: `${dcCommonStatus(dc)}\n\n${worldStatuses(dc.Servers)}`,
        inline: true
    }))
}

function dcCommonStatus(dc: Dc): string {
    const metrics: [string, number, number, string][] = [
        ['Lobby', dc.LobbyStatus, dc.LobbyPing, 'ms'],
        ['Servers Ping', dc.ServersPingStatus, dc.ServersPing, 'ms'],
        ['Packetloss', dc.PacketLossStatus, dc.PacketLoss, 'ms'],
        ['Ports Open', dc.GamePortsOpenStatus, dc.GamePortsOpen, '%'],
    ]
    // eslint-disable-next-line no-irregular-whitespace
    return metrics.map(([metric, status, value, unit]) => `${emoji(status)} ${metric} - ${value}${unit}`).join('\n')
}

function worldStatuses(data: Server[]): string {
    // eslint-disable-next-line no-irregular-whitespace
    return data.map(srv => `${emoji(srv.Status)} ${srv.Name}`).join('\n');
}

function emoji(status: number): string {
    switch (status) {
        case 1:
            return '🔴';
        case 2:
            return '🟠';
        case 4:
            return '🟢';
    }

    return '⚫';
}
