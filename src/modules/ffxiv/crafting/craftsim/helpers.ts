import { PriceData } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";
import { Recipe } from "@/modules/ffxiv/crafting/craftsim/Recipe";
import { Ingredient } from "@/modules/ffxiv/crafting/craftsim/Ingredient";

/**
 * Gets the sale price of an item and velocity
 * Takes out 5% for market tax
 * Returns null if item is not marketable or if no listing data exists
 * Assumes that item is HQ
 */
export function getSalePrice(priceData: PriceData, itemId: string, worldId: string): number | null {
    const itemPriceData = priceData[itemId];

    if (!itemPriceData) {
        return null;
    }

    const worldPriceData = itemPriceData[worldId];

    if (!worldPriceData) {
        return null;
    }

    const [, nqAvgPrice,] = worldPriceData.nq;
    const [, hqAvgPrice,] = worldPriceData.hq;


    const salePrice = hqAvgPrice ? hqAvgPrice : nqAvgPrice;

    if (salePrice === null) {
        return null;
    }

    return salePrice - (0.05 * salePrice);
}

/**
 * Calculates the cost to craft an item using the cheapest ingredients
 * The returned best price is for a single unit
 * The returned best price includes 5% market tax for item purchases
 */
export function costToCraft(priceData: PriceData, recipes: Recipe[]) {
    let bestPrice = Infinity;

    for (const recipe of recipes) {
        let totalCost = 0;

        for (const ingredient of recipe.ingredients) {
            totalCost += costOfIngredient(priceData, ingredient);
        }

        totalCost = totalCost / recipe.result.quantity;

        if (totalCost < bestPrice) {
            bestPrice = totalCost;
        }
    }

    return bestPrice;
}

/**
 * Gets the cost of an ingredient.
 *
 * Since an "ingredient" object includes quantity, the market value is multiplied by the quantity.
 * Additionally, 5% is added to each for market taxes
 * Assumed that the user will be buying NQ items unless not available
 * If item is not marketable or no price data exists, the price is returned as Infinity
 */
export function costOfIngredient(priceData: PriceData, ingredient: Ingredient): number {
    const priceDataForItem = priceData[ingredient.item];

    if (!priceDataForItem) {
        return Infinity;
    }

    let cheapestUnitCost = Infinity;

    for(const worldPriceData of Object.values(priceDataForItem)) {
        const [nqMinPrice,,] = worldPriceData.nq;
        const [hqMinPrice,,] = worldPriceData.hq;
        const marketPrice = Math.min(nqMinPrice ?? Infinity, hqMinPrice ?? Infinity);
        if (marketPrice < cheapestUnitCost) {
            cheapestUnitCost = marketPrice;
        }
    }

    const unitCostWithTax = cheapestUnitCost * 1.05;

    return unitCostWithTax * ingredient.quantity;
}
