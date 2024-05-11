import {Application} from "@/common/Application";

export class GuildConfigMap {
    protected readonly app: Application;

    protected readonly guildId: string;

    constructor(app: Application, guildId: string) {
        this.app = app;
        this.guildId = guildId;
    }

    /*public get(key: string): unknown {
        //
    }

    public set(key: string, value: unknown): this {
        //
    }*/
}
