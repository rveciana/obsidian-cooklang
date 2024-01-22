import type { Ingredient, Cookware, Timer, Text } from "@cooklang/cooklang-ts";
import { franc } from "franc";
import type { TAbstractFile, TFile } from "obsidian";
import { iso6393To1 } from "./langCodes";

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

export const isTFile = (file: TAbstractFile): file is TFile => {
    return (file as TFile).basename !== undefined;
};

export const getI18n = (data:string) => {

    const detectedLang=iso6393To1[franc(data)];
    const userLang = window.localStorage.getItem('language');
    return detectedLang??userLang??'en';
    
    
}
