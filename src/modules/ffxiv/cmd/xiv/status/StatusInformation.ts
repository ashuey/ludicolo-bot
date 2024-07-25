export interface StatusInformation {
    readonly Header:   Header;
    readonly Graphs:   Graphs;
    readonly Global:   Global;
    readonly NARegion: Region;
    readonly EURegion: Region;
    readonly AURegion: Region;
    readonly JPRegion: Region;
    readonly News:     News;
}

export interface Region {
    readonly DCs: Dc[];
}

export interface Dc {
    readonly Name:                string;
    readonly LobbyPing:           number;
    readonly LobbyStatus:         number;
    readonly ServersPing:         number;
    readonly ServersPingStatus:   number;
    readonly PacketLoss:          number;
    readonly PacketLossStatus:    number;
    readonly GamePortsOpen:       number;
    readonly GamePortsOpenStatus: number;
    readonly Servers:             Server[];
}

export interface Server {
    readonly Name:   string;
    readonly Status: number;
}

export interface Global {
    readonly LoginServerStatus: number;
    readonly GateServerStatus:  number;
}

export interface Graphs {
    readonly PageViewsPerMin: number[];
}

export interface Header {
    readonly DateVersion:        string;
    readonly PageName:           string;
    readonly PageGenerationTime: number;
    readonly RefreshTime:        number;
}

export interface News {
    readonly News:        null;
    readonly Message:     null;
    readonly ShowMessage: boolean;
    readonly ShowNews:    boolean;
}

export enum Status {
    Down = 1,
    Degraded = 2,
    Unknown = 3,
    Up = 4,
}
