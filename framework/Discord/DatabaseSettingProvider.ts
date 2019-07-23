import {CommandoClient, SettingProvider, GuildExtension} from 'discord.js-commando'
import {Guild} from "discord.js";
import DatabaseManager from "../Contracts/Database/DatabaseManager";
import {updateOrInsert} from "../Database/util";

export default class DatabaseSettingProvider extends SettingProvider {
    protected db: DatabaseManager;

    protected client: CommandoClient;

    protected listeners: Map<string, any> = new Map<string, any>();

    constructor(db: DatabaseManager) {
        super();
        this.db = db;
    }

    async init(client: CommandoClient): Promise<void> {
        this.client = client;
        this.initializeSchema();
        this.initializeListeners();
    }

    async clear(guild: Guild | string): Promise<void> {
        const guildId: string = SettingProvider.getGuildID(guild);

        this.db.table('settings').where('guild', guildId).del();
    }

    async destroy(): Promise<void> {
    }

    async get(guild: Guild | string, key: string, defVal?: any): Promise<any> {
        const guildId: string = SettingProvider.getGuildID(guild);

        const result = await this.db.select('value').from('settings').where('guild', guildId).where('key', key).limit(1);

        if (result.length > 0) {
            return JSON.parse(result[0].value);
        }

        return defVal;
    }

    async remove(guild: Guild | string, key: string): Promise<any> {
        const guildId: string = SettingProvider.getGuildID(guild);

        await this.db.table('settings').where('guild', guildId).where('key', key).del()
    }

    async set(guild: Guild | string, key: string, val: any): Promise<any> {
        const guildId: string = SettingProvider.getGuildID(guild);

        await updateOrInsert('settings', {
            guild: guildId,
            key: key
        }, {
            value: JSON.stringify(val)
        })
    }

    protected initializeSchema(): void {
        this.db.schema.hasTable('settings').then(exists => {
            if (!exists) {
                return this.db.schema.createTable('settings', t => {
                    t.increments('id').primary();
                    t.string('guild').index();
                    t.string('key').index();
                    t.text('value');
                });
            }
        });
    }

    protected initializeListeners(): void {
        // Listen for changes
        this.listeners
            .set('commandPrefixChange', (guild, prefix) => this.set(guild, 'prefix', prefix))
            .set('ready', () => this.initializeExistingGuilds());
        for (const [event, listener] of this.listeners) this.client.on(event, listener);
    }

    protected async initializeExistingGuilds(): Promise<void> {
        const guildPrefixes = await this.db.table('settings').where('key', 'prefix');

        for (const guildPrefix of guildPrefixes) {
            // @ts-ignore
            const guild: GuildExtension = this.client.guilds.get(guildPrefix.guild);
            guild.commandPrefix = JSON.parse(guildPrefix.value);
        }
    }
}