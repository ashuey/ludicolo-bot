import {Application} from "@/common/Application";
import {Guild} from "discord.js";
import {GuildConfigMap} from "@/common/guildConfig/GuildConfigMap";
import {recordGetOrMake} from "@/helpers/map";

export class GuildConfigManager {
    protected app: Application;

    protected cache: Record<string, GuildConfigMap> = {};

    constructor(app: Application) {
        this.app = app;
    }

    public for(guild: Guild | string): GuildConfigMap {
        const guildId = typeof guild === "string" ? guild : guild.id;

        return recordGetOrMake(this.cache, guildId, () => new GuildConfigMap(this.app, guildId));
    }
}
