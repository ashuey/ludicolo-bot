import { costOfIngredient, costToCraft, getSalePrice } from "@/modules/ffxiv/crafting/craftsim/helpers";
import { PriceData } from "@/modules/ffxiv/lib/tataru/TataruRESTClient";
import { Recipe } from "@/modules/ffxiv/crafting/craftsim/Recipe";

describe("getSalePrice", () => {
    it('should return null if item is not marketable', () => {
        const priceData: PriceData = {};
        expect(getSalePrice(priceData, "itemXYZ", "world10")).toEqual(null);
    });

    it('should return null if no listing data exists', () => {
        const priceData: PriceData = {"itemABC": { "world10": { nq: [null, null, null], hq: [null, null, null]}}};
        expect(getSalePrice(priceData, "itemABC", "world10")).toEqual(null);
    });

    it('should return HQ price if available', () => {
        const priceData: PriceData = {
            "itemXYZ": {
                "world10": {
                    nq: [null, 10, null],
                    hq: [null, 15, null],
                }
            }
        };
        expect(getSalePrice(priceData, "itemXYZ", "world10")).toBeCloseTo(14.25);
    });

    it('should return NQ price if no HQ price is available', () => {
        const priceData: PriceData = {
            "itemXYZ": {
                "world10": {
                    nq: [null, 10, null],
                    hq: [null, null, null],
                }
            }
        };
        expect(getSalePrice(priceData, "itemXYZ", "world10")).toBeCloseTo(9.5);
    });
})

describe('costToCraft', () => {
    it('should calculate the lowest total cost for a given recipe', () => {
        const priceData: PriceData = {
            "item1": {"10": { nq: [1, null, null], hq: [null, null, null] } },
            "item2": {"10": { nq: [2, null, null], hq: [null, null, null] } },
            "item3": {"10": { nq: [3, null, null], hq: [null, null, null] } },
            "item4": {"10": { nq: [4, null, null], hq: [null, null, null] } },
        };

        const recipe1: Recipe = { // costPerUnit: 3.15
            result: {item: "99", quantity: 1},
            ingredients: [
                {item: "item1", quantity: 1}, // cost: 1.05
                {item: "item2", quantity: 1}, // cost: 2.10
            ]
        };

        const recipe2: Recipe = {
            result: {item: "99", quantity: 3}, // costPerUnit: 2.80
            ingredients: [
                {item: "item1", quantity: 2}, // cost: 2.10
                {item: "item2", quantity: 3}, // cost: 6.30
            ]
        };

        const recipes= [recipe1, recipe2];

        expect(costToCraft(priceData, recipes)).toBeCloseTo(2.8);

    });

    it('should return an Infinity cost when an ingredient can not be bought on the marketplace', () => {
        const priceData: PriceData = {
            "item1": {"10": { nq: [null, 1, null], hq: [null, null, null] } },
            "item2": {"10": { nq: [null, 2, null], hq: [null, null, null] } },
            "item3": {"10": { nq: [null, 3, null], hq: [null, null, null] } },
            "item4": {"10": { nq: [null, 4, null], hq: [null, null, null] } },
        };

        const recipe: Recipe = { // costPerUnit: 3.15
            result: {item: "99", quantity: 1},
            ingredients: [
                {item: "item1", quantity: 1},
                {item: "item5", quantity: 1},
            ]
        };

        const recipes= [recipe];

        expect(costToCraft(priceData, recipes)).toEqual(Infinity);
    });
})

describe('costOfIngredient', () => {
    it('should return Infinity when item is not marketable', () => {
        const priceData = {};
        expect(costOfIngredient(priceData, {item: "100", quantity: 1})).toEqual(Infinity);
    });

    it('should return Infinity when there is no price data', () => {
        const priceData: PriceData = {"150": {"10": { nq: [null, null, null], hq: [null, null, null] }}};
        expect(costOfIngredient(priceData, {item: "150", quantity: 1})).toEqual(Infinity);
    });

    it('should calculate the cost of an item based on the available market prices and quantity', () => {
        const priceData: PriceData = {
            "200": {
                "10": { nq: [10, null, null], hq: [null, null, null] },
                "20": { nq: [null, null, null], hq: [9, null, null] },
                "30": { nq: [8, null, null], hq: [null, null, null] },
                "40": { nq: [6, null, null], hq: [7, null, null] },
            }
        };
        expect(costOfIngredient(priceData, {item: "200", quantity: 1})).toBeCloseTo(6 * 1.05);
    });

    it('should use HQ price when NQ is not available', () => {
        const priceData: PriceData = {"300": {"10": { nq: [null, null, null], hq: [15, null, null] }}};
        expect(costOfIngredient(priceData, {item: "300", quantity: 1})).toBeCloseTo(15 * 1.05);
    });

    it('should use the cheapest among the NQ price and HQ price', () => {
        const priceData: PriceData = {"400": {"10": { nq: [10, null, null], hq: [9, null, null] }}};
        expect(costOfIngredient(priceData, {item: "400", quantity: 1})).toBeCloseTo(9 * 1.05);
    });

    it('should account for the quantity while calculating the cost', () => {
        const priceData: PriceData = {"500": {"10": { nq: [10, null, null], hq: [null, null, null] }}};
        expect(costOfIngredient(priceData, {item: "500", quantity: 2})).toEqual((10 * 1.05) * 2);
    });
});
