import { Ingredient } from "@/modules/ffxiv/lib/staticdata/types/Ingredient";

export interface Recipe {
    result: Ingredient;
    ingredients: Ingredient[];
}
