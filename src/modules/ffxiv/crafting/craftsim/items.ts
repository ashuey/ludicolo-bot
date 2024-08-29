import { Cache } from "@/common/cache/Cache";
import { parserFromResponse } from "@/helpers/csv";
import { PriceData } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";

const EXPECTED_COLUMN_COUNT = 92;
const IDX_ITEM_ID = 0;
const IDX_ITEM_NAME = 10;
const CACHE_KEY = 'ffxiv-item-names-all';
const CACHE_TIME = 30 * 24 * 60 * 60; // 30 days

type ItemNameMap = Record<string, string>;

export async function getItemNames(priceData: PriceData, cache?: Cache): Promise<ItemNameMap> {
    if (cache) {
        const cached = cache.get<ItemNameMap>(CACHE_KEY);
        if (cached) {
            return cached;
        }
    }

    const response = await fetch("https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/Item.csv");

    return new Promise(resolve => {
        const result: ItemNameMap = {};

        const parser = parserFromResponse(response, {
            from: 5,
        });

        parser.on('readable', function(){
            let record; while ((record = parser.read()) !== null) {
                if (record.length !== EXPECTED_COLUMN_COUNT) {
                    throw new Error("Record had unexpected column count");
                }

                const itemId = record[IDX_ITEM_ID];

                if (Object.hasOwn(priceData, itemId)) {

                    const itemName = record[IDX_ITEM_NAME];

                    if (itemId && itemName) {
                        result[itemId] = itemName;
                    }
                }
            }
        })

        parser.on('end', function(){
            if (cache) {
                cache.set<ItemNameMap>(CACHE_KEY, result, CACHE_TIME);
            }

            resolve(result);
        });
    });
}
