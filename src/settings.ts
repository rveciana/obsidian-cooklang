export interface CookLangSettings {
    showImages: boolean;
    showIngredientList: boolean;
    showCookwareList: boolean;
    showTimersList: boolean;
    showTotalTime: boolean;
    showTimersInline: boolean;
    showQuantitiesInline: boolean;
    timersTick: boolean;
    timersRing: boolean;
}

export const DEFAULT_SETTINGS: CookLangSettings = {
    showImages: true,
    showIngredientList: true,
    showCookwareList: true,
    showTimersList: true,
    showTotalTime: true,
    showTimersInline: true,
    showQuantitiesInline: true,
    timersTick: true,
    timersRing: true,
};
