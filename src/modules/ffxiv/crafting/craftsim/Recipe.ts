import { Ingredient } from "@/modules/ffxiv/crafting/craftsim/Ingredient";

export interface Recipe {
    result: Ingredient;
    ingredients: Ingredient[];
}
