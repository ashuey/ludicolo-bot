export type GuildAlertConfig = GuildAlertConfigItem[];

export interface GuildAlertConfigItem {
    world?: string;
    threshold?: number;
    role: string;
}
