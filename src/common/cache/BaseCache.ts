export abstract class BaseCache {
    abstract get<T = unknown>(key: string): T | undefined;
    abstract set<T = unknown>(key: string, value: T, ttl: number): void
    abstract delete(key: string): void;

    getMultiple<T = unknown>(keys: string[]): Record<string, T | undefined> {
        return keys.reduce((result,key)=> {
            result[key] = this.get<T>(key);
            return result;
        },{} as Record<string, T | undefined>);
    }

    setMultiple(values: Record<string, unknown>, ttl: number): void {
        Object.entries(values).forEach(([key, value]) => this.set(key, value, ttl));
    }

    deleteMultiple(keys: string[]): void {
        keys.forEach((key: string) => this.delete(key));
    }
}
