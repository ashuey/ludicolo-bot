import { TataruRESTClient } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";
import { Cache } from "@/common/cache/Cache";
import { getAllRecipes } from "@/modules/ffxiv/crafting/craftsim/recipes";
import { getPriceData } from "@/modules/ffxiv/crafting/craftsim/pricedata";
import { getItemNames } from "@/modules/ffxiv/crafting/craftsim/items";
import { costToCraft, getSalePrice } from "@/modules/ffxiv/crafting/craftsim/helpers";
import { logger } from "@/logger";

export class CraftMarketSim {
    static readonly GILGAMESH_WORLD_ID = "63";

    static readonly MAX_SALE_COST = 2000000;

    static readonly MAX_INGREDIENT_COST = 1000000;

    protected readonly cache: Cache;

    protected readonly tataruRESTClient: TataruRESTClient;

    constructor(cache: Cache, tataruRESTClient: TataruRESTClient) {
        this.cache = cache;
        this.tataruRESTClient = tataruRESTClient;
    }

    async craftsim() {
        // Load data
        logger.debug("Loading Price Data");
        const priceData = await getPriceData(this.tataruRESTClient, this.cache);
        logger.debug("Loading Recipe Data");
        const recipes = await getAllRecipes(this.cache);
        logger.debug("Loading Item Names");
        const itemNames = await getItemNames(priceData, this.cache);

        // init result array
        const result: [string, number][] = [];

        logger.debug("Iterating recipes");
        // for all recipes
        for (const [itemId, itemRecipes] of Object.entries(recipes)) {
            // get sale price
            const salePrice = getSalePrice(priceData, itemId, CraftMarketSim.GILGAMESH_WORLD_ID);

            if (!salePrice || salePrice > CraftMarketSim.MAX_SALE_COST) {
                continue;
            }

            // get price to craft item
            const craftingPrice = costToCraft(priceData, itemRecipes);

            if (craftingPrice === Infinity || craftingPrice > CraftMarketSim.MAX_INGREDIENT_COST) {
                continue;
            }

            const profit = salePrice - craftingPrice;

            if (profit <= 0) {
                continue;
            }

            // get item name
            const itemName = itemNames[itemId];

            if (!itemName) {
                continue;
            }

            // push to result array: item name and profit per craft
            const recipeResultData: [string, number] = [itemName, Math.floor(profit)];
            result.push(recipeResultData);
        }

        logger.debug("Sorting results")

        // sort result array by profit
        result.sort(([,aProfit], [,bProfit]) => bProfit - aProfit);

        logger.debug("Returning results")
        // return results
        return result;
    }
}
