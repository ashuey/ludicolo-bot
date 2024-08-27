import { Knex } from "knex";
import { StaticDataTypes } from "@/modules/ffxiv/lib/staticdata/StaticDataTypes";
import { staticDataProviders } from "@/modules/ffxiv/lib/staticdata/providers";
import { STATIC_DATA_TABLE } from "@/modules/ffxiv/tables";
import { StaticDataEntry } from "@/modules/ffxiv/models/StaticDataEntry";

export class StaticDataManager {
    protected readonly db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async get<T extends keyof StaticDataTypes>(key: T): Promise<StaticDataTypes[T] | undefined> {
        key;
        return undefined;
    }

    async has(key: keyof StaticDataTypes): Promise<boolean> {
        key;
        return false;
    }

    async refresh() {
        for await (const [key, provider] of Object.entries(staticDataProviders)) {
            const data = provider.encode(await provider.refresh());
            await this.db<StaticDataEntry>(STATIC_DATA_TABLE)
                .insert({
                    key,
                    data,
                    updated_at: Math.floor(Date.now() / 1000)
                })
                .onConflict('key')
                .merge();
        }
    }
}
