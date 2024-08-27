import { StaticDataTypes } from "@/modules/ffxiv/lib/staticdata/StaticDataTypes";
import { StaticDataProvider } from "@/modules/ffxiv/lib/staticdata/StaticDataProvider";
import { recipeProvider } from "@/modules/ffxiv/lib/staticdata/providers/recipe";

export const staticDataProviders: {
    [K in keyof StaticDataTypes]: StaticDataProvider<StaticDataTypes[K]>;
} = {
    recipes: recipeProvider,
}
