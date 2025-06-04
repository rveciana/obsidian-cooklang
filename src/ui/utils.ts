import type { Ingredient, Cookware, Timer, Text } from "@cooklang/cooklang-ts";
import { franc } from "franc";
import { iso6393To1 } from "./langCodes.js";
import { type TAbstractFile, TFile } from "obsidian";

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
    if (file instanceof TFile)
        return file.basename !== undefined;
    return false;
};

export const getI18n = (data:string) => {

    const detectedLang=iso6393To1[franc(data)];
    const userLang = window.localStorage.getItem('language');
    return detectedLang??userLang??'en';
    
    
}

const formatFraction = (num:number, useFraction:boolean=false) =>{
    if(!useFraction) return num.toString();
    const epsilon = 0.0001;
    if (Math.abs(num - 1 / 2) < epsilon) return "1/2";
    else if (Math.abs(num - 1 / 3) < epsilon) return "1/3";
    else if (Math.abs(num - 2 / 3) < epsilon) return "2/3";
    else if (Math.abs(num - 1 / 4) < epsilon) return "1/4";
    else if (Math.abs(num - 3 / 4) < epsilon) return "3/4";
    else if (Math.abs(num - 1 / 5) < epsilon) return "1/5";
    else if (Math.abs(num - 2 / 5) < epsilon) return "2/5";
    else if (Math.abs(num - 3 / 5) < epsilon) return "3/5";
    else if (Math.abs(num - 4 / 5) < epsilon) return "4/5";
    else if (Math.abs(num - 1 / 6) < epsilon) return "1/6";
    else if (Math.abs(num - 5 / 6) < epsilon) return "5/6";
    else if (Math.abs(num - 1 / 7) < epsilon) return "1/7";
    else if (Math.abs(num - 1 / 8) < epsilon) return "1/8";
    else if (Math.abs(num - 3 / 8) < epsilon) return "3/8";
    else if (Math.abs(num - 5 / 8) < epsilon) return "5/8";
    else if (Math.abs(num - 7 / 8) < epsilon) return "7/8";
    else if (Math.abs(num - 1 / 9) < epsilon) return "1/9";
    else if (Math.abs(num - 1 / 10) < epsilon) return "1/10";
    else if (Math.abs(num - 1 / 12) < epsilon) return "1/12";
    else if (Math.abs(num - 1 / 16) < epsilon) return "1/16";
    else if (Math.abs(num - 1 / 32) < epsilon)return "1/32";

    // If no fraction matches, just return
    return +num.toFixed( 1 );
}
export const formatNumber = (num: number|string, useFraction:boolean=false, scale=1): string => {
    const str = String(num);
    const parts = str.match(/\d+|[a-zA-Z']+/g); 
    if (!parts) return str; 
    return parts.map(part => /^\d+$/.test(part) ? formatFraction(Number(part)*scale, useFraction) : part).join("");
};