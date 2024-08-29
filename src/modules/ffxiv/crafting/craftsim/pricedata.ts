import { PriceData, TataruRESTClient } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";
import { Cache } from "@/common/cache/Cache";

const CACHE_KEY = 'ffxiv-price-data';
const CACHE_TIME = 10 * 60; // 10 minutes

export async function getPriceData(tataruRESTClient: TataruRESTClient, cache?: Cache): Promise<PriceData> {
    if (cache) {
        const cached = cache.get<PriceData>(CACHE_KEY);
        if (cached) {
            return cached;
        }
    }

    const result = await tataruRESTClient.allPrices();

    if (cache) {
        cache.set<PriceData>(CACHE_KEY, result, CACHE_TIME);
    }

    return result;
}
