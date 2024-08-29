import { parserFromResponse } from "@/helpers/csv";
import { Recipe } from "@/modules/ffxiv/crafting/craftsim/Recipe";
import { Cache } from "@/common/cache/Cache";

const EXPECTED_COLUMN_COUNT = 46;
const IDX_RESULT = 4;
const IDX_FIRST_INGREDIENT = 6;
const INGREDIENT_COUNT = 8;
const CACHE_KEY = 'ffxiv-recipes-all';
const CACHE_TIME = 30 * 24 * 60 * 60; // 30 days

type Recipes = Record<string, Recipe[]>;

export async function getAllRecipes(cache?: Cache): Promise<Recipes> {
    if (cache) {
        const cached = cache.get<Recipes>(CACHE_KEY);
        if (cached) {
            return cached;
        }
    }

    const response = await fetch("https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/Recipe.csv");

    const parser = parserFromResponse(response, {
        from: 4,
    });

    const recipes: Recipes = {};

    for await (const record of parser) {
        if (record.length !== EXPECTED_COLUMN_COUNT) {
            throw new Error("Record had unexpected column count");
        }

        const resultItemId = String(record[IDX_RESULT]);

        const recipe: Recipe = {
            result: {
                item: resultItemId,
                quantity: Number(record[IDX_RESULT + 1])
            },
            ingredients: []
        }

        for (let i = IDX_FIRST_INGREDIENT; i < (IDX_FIRST_INGREDIENT + (2 * INGREDIENT_COUNT)); i += 2) {
            const ingredientItemId = String(record[i]);
            if (record[i] !== "0") {
                recipe.ingredients.push({
                    item: ingredientItemId,
                    quantity: Number(record[i+1]),
                });
            }
        }

        const result = recipes[resultItemId] ?? [];
        result.push(recipe);
        recipes[resultItemId] = result;
    }

    if (cache) {
        cache.set<Recipes>(CACHE_KEY, recipes, CACHE_TIME);
    }

    return recipes;
}
