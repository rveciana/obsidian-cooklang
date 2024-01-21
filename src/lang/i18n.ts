import i18next from "i18next";
import { createI18nStore } from "svelte-i18next";
import { resources } from "./resources";

i18next.init({
 lng: 'en',
 fallbackLng: 'en',
 resources: resources,
  interpolation: {
    escapeValue: false, // not needed for svelte as it escapes by default
  }
});

export const i18n = createI18nStore(i18next);
export default i18n;