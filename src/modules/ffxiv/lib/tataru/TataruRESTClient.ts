import { parserFromResponse } from "@/helpers/csv";
import { UpstreamServiceError } from "@/common/errors/UpstreamServiceError";
import { logger } from "@/logger";

export interface WorldPriceData {
    nq: [number | null, number | null, number | null]
    hq: [number | null, number | null, number | null],
}
export type PriceData = Record<string, Record<string, WorldPriceData>>;

export class TataruRESTClient {
    static readonly ENDPOINT =  "https://ribbit.sh";

    protected apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async allPrices() {
        const response = await this.request('api/all-prices');

        if (response.status !== 200) {
            logger.warn(`Error while fetching price data: ${response.status} ${response.statusText}`);
            throw new UpstreamServiceError();
        }

        const parser = parserFromResponse(response, {
            from: 2,
        });

        const result: PriceData = {};

        for await (const record of parser) {
            const [itemId,worldId,hqStatus,avgPrice,velocity,minPrice,]: [string, string, string, string, string, string, string] = record;
            const itemRecord = result[itemId] ?? {};
            const qKey = hqStatus === "HQ" ? "hq" : "nq";
            const worldRecord = itemRecord[worldId] ?? { nq: [null, null, null], hq: [null, null, null] };
            worldRecord[qKey] = [
                minPrice ? Number(minPrice) : null,
                avgPrice ? Number(avgPrice) : null,
                velocity ? Number(velocity) : null,
            ];
            itemRecord[worldId] = worldRecord;
            result[itemId] = itemRecord;
        }

        return result;
    }

    protected async request(path: string) {
        const url = new URL(path, TataruRESTClient.ENDPOINT);
        return await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }
}
