import {Cache} from "@/common/cache/Cache";
import {BaseCache} from "@/common/cache/BaseCache";

const SECOND = 1000;

export class SimpleMemoryCache extends BaseCache implements Cache {
    protected data = new Map<string, [number, unknown]>();

    get<T = unknown>(key: string): T | undefined {
        const record = this.data.get(key);

        return (!!record && this.isFresh(record)) ? record[1] as T : undefined;
    }

    set(key: string, value: unknown, ttl: number): void {
        this.data.set(key, [Date.now() + (ttl * SECOND), value]);
    }

    delete(key: string): void {
        this.data.delete(key);
    }

    clear(): void {
        this.data.clear();
    }

    has(key: string): boolean {
        const record = this.data.get(key);

        return !!record && this.isFresh(record)
    }

    cleanup(): void {
        [...this.data.keys()].forEach(key => {
            const record = this.data.get(key);
            if (record && !this.isFresh(record)) {
                this.data.delete(key);
            }
        });
    }

    protected isFresh([expiration,]: [number, unknown]): boolean {
        return Date.now() < expiration;
    }
}
