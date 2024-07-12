import {Cache} from "@/common/cache/Cache";

const SECOND = 1000;

export class SimpleMemoryCache implements Cache {
    protected data = new Map<string, [number, unknown]>();

    get(key: string, _default: unknown = undefined): unknown {
        const record = this.data.get(key);

        return (!!record && this.isFresh(record)) ? record[1] : _default;
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

    getMultiple(keys: string[], _default: unknown): Record<string, unknown> {
        return keys.reduce((result,key)=> {
            result[key] = this.get(key, _default);
            return result;
        },{} as Record<string, unknown>);
    }

    setMultiple(values: Record<string, unknown>, ttl: number): void {
        Object.entries(values).forEach(([key, value]) => this.set(key, value, ttl));
    }

    deleteMultiple(keys: string[]): void {
        keys.forEach((key: string) => this.delete(key));
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
