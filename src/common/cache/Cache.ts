export interface Cache {
    get<T = unknown>(key: string): T | undefined;
    set<T = unknown>(key: string, value: T, ttl: number): void;
    delete(key: string): void;
    clear(): void;
    getMultiple<T = unknown>(keys: string[]): Record<string, T | undefined>;
    setMultiple<T = unknown>(values: Record<string, T>, ttl: number): void;
    deleteMultiple(keys: string[]): void;
    has(key: string): boolean;
}
