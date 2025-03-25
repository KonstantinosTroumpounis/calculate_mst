import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "gr"],
    fallbackLng: "en",
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    backend: {
      loadPath: 'https://konstantinostroumpounis.github.io/calculate_mst/locales/{{lng}}/translation.json',
      crossDomain: true
    },
    interpolation: {
      escapeValue: false, // React already escapes content
    },
  });

export default i18n;