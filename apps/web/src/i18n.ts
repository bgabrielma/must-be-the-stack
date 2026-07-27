import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

// English is the only locale today; every user-facing string in the app
// (outside .stories.tsx, which render fixed English for the component
// gallery) still routes through this so adding a second locale later is a
// data change, not a rewrite of every component.
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
