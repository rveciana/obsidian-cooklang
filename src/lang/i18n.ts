import i18next from "i18next";
import { createI18nStore } from "svelte-i18next";

i18next.init({
 lng: 'en',
 fallbackLng: 'en',
 resources: {
    en: {
      translation: {
        "empty": "Empty recipe. Edit it using the pencil icon.",
        "method": "Method",
        "ingredients": "Ingredients",
        "cookware": "Cookware",
        "step": "Step",
      }
    }
  },
  interpolation: {
    escapeValue: false, // not needed for svelte as it escapes by default
  }
});

export const i18n = createI18nStore(i18next);
export default i18n;