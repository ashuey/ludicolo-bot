import { StaticDataProvider } from "@/modules/ffxiv/lib/staticdata/StaticDataProvider";

export function mapEncodedProvider<T extends Map<unknown, unknown>>(refresh: () => Promise<T>): StaticDataProvider<T> {
    return {
        encode(data: T): string {
            return JSON.stringify([...data.entries()])
        },
        decode(raw: string): T {
            return new Map(JSON.parse(raw)) as T;
        },
        refresh,
    }
}
