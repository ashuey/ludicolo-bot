export interface Cache {
    get(key: string, _default: unknown): unknown;
    set(key: string, value: unknown, ttl: number): void;
    delete(key: string): void;
    clear(): void;
    getMultiple(keys: string[], _default: unknown): Record<string, unknown>;
    setMultiple(values: Record<string, unknown>, ttl: number): void;
    deleteMultiple(keys: string[]): void;
    has(key: string): boolean;
}
