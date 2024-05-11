export interface GuildConfigAccessor {
    load(guildId: string): Promise<Record<string, unknown>>;
    save(guildId: string, data: Record<string, unknown>): Promise<unknown>;
}
