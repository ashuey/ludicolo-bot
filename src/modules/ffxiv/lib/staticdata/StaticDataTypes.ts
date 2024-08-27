import { Recipe } from "@/modules/ffxiv/lib/staticdata/types/Recipe";

export type StaticDataTypes = {
    recipes: Map<number, Recipe[]>
}
