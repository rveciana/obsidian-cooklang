import type { Ingredient, Cookware, Timer, Text } from "@cooklang/cooklang-ts";

export const isText = (
    step: Ingredient | Cookware | Timer | Text
): step is Text => {
    return (step as Text).type === "text";
};
export const isIngredient = (
    step: Ingredient | Cookware | Timer | Text
): step is Ingredient => {
    return (step as Ingredient).type === "ingredient";
};
export const isCookware = (
    step: Ingredient | Cookware | Timer | Text
): step is Cookware => {
    return (step as Cookware).type === "cookware";
};
export const isTimer = (
    step: Ingredient | Cookware | Timer | Text
): step is Timer => {
    return (step as Timer).type === "timer";
};
