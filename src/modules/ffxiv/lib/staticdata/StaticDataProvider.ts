export interface StaticDataProvider<T> {
    encode(data: T): string;
    decode(raw: string): T;
    refresh(): Promise<T>;
}
