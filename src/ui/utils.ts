import type { Ingredient, Cookware, Timer, Text } from "@cooklang/cooklang-ts";
import { franc } from "franc";
import { iso6393To1 } from "./langCodes";
import { TAbstractFile, TFile } from "obsidian";

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

export const formatNumber = (num: number|string, useFraction:boolean=false): string => {
    if(typeof num === 'string') return num;
    const epsilon = 0.0001;
    if(Math.abs(num - 1/2) < epsilon) return useFraction?"1/2":"0.5";
    else if(Math.abs(num - 1/3) < epsilon) return useFraction?"1/3":"0.33";
    else if(Math.abs(num - 2/3) < epsilon) return useFraction?"2/3":"0.66";
    else if(Math.abs(num - 1/4) < epsilon) return useFraction?"1/4":"0.25";
    else if(Math.abs(num - 3/4) < epsilon) return useFraction?"3/4":"0.75";
    else if(Math.abs(num - 1/5) < epsilon) return useFraction?"1/5":"0.2";
    else if(Math.abs(num - 2/5) < epsilon) return useFraction?"2/5":"0.4";
    else if(Math.abs(num - 3/5) < epsilon) return useFraction?"3/5":"0.6";
    else if(Math.abs(num - 4/5) < epsilon) return useFraction?"4/5":"0.8";
    else if(Math.abs(num - 1/6) < epsilon) return useFraction?"1/6":"0.16";
    else if(Math.abs(num - 5/6) < epsilon) return useFraction?"5/6":"0.83";
    else if(Math.abs(num - 1/7) < epsilon) return useFraction?"1/7":"0.14";
    else if(Math.abs(num - 1/8) < epsilon) return useFraction?"1/8":"0.125";
    else if(Math.abs(num - 3/8) < epsilon) return useFraction?"3/8":"0.375";
    else if(Math.abs(num - 5/8) < epsilon) return useFraction?"5/8":"0.625";
    else if(Math.abs(num - 7/8) < epsilon) return useFraction?"7/8":"0.875";
    else if(Math.abs(num - 1/9) < epsilon) return useFraction?"1/9":"0.11";
    else if(Math.abs(num - 1/10) < epsilon) return useFraction?"1/10":"0.1";
    else if(Math.abs(num - 1/12) < epsilon) return useFraction?"1/12":"0.08";
    else if(Math.abs(num - 1/16) < epsilon) return useFraction?"1/16":"0.06";
    else if(Math.abs(num - 1/32) < epsilon) return useFraction?"1/32":"0.03";
    else return num.toString();
};