import { Readable } from 'node:stream';
import type { ReadableStream } from 'node:stream/web';
import { parse } from "csv-parse";
import { Recipe } from "@/modules/ffxiv/lib/staticdata/types/Recipe";
import { mapEncodedProvider } from "@/modules/ffxiv/lib/staticdata/providers/mapEncodedProvider";

const EXPECTED_COLUMN_COUNT = 46;
const IDX_RESULT = 4;
const IDX_FIRST_INGREDIENT = 6;
const INGREDIENT_COUNT = 8;

export const recipeProvider = mapEncodedProvider(async () => {
    const response = await fetch("https://raw.githubusercontent.com/xivapi/ffxiv-datamining/master/csv/Recipe.csv");
    const body = response.body;

    if (body === null) {
        throw new Error("Response body was empty");
    }

    const parser = parse({
        from: 4,
    });

    // These type conversions are nonsense. Blame the Node.js stream types.
    const rStream= Readable.fromWeb(body as ReadableStream<Uint8Array>);
    rStream.pipe(parser as unknown as NodeJS.WritableStream);

    const recipes = new Map<number, Recipe[]>();

    for await (const record of parser) {
        if (record.length !== EXPECTED_COLUMN_COUNT) {
            throw new Error("Record had unexpected column count");
        }

        const resultItemId = Number(record[IDX_RESULT]);

        if (record[IDX_RESULT] === "42889") {
            const recipe: Recipe = {
                result: {
                    item: resultItemId,
                    quantity: Number(record[IDX_RESULT + 1])
                },
                ingredients: []
            }

            for (let i = IDX_FIRST_INGREDIENT; i < (IDX_FIRST_INGREDIENT + (2 * INGREDIENT_COUNT)); i += 2) {
                const ingredientItemId = Number(record[i]);
                if (record[i] !== "0") {
                    recipe.ingredients.push({
                        item: ingredientItemId,
                        quantity: Number(record[i+1]),
                    });
                }
            }

            const result = recipes.get(resultItemId) ?? [];
            result.push(recipe);
            recipes.set(resultItemId, result);
        }
    }

    return recipes;
})
