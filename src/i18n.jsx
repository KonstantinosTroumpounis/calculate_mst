import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const basePath = window.location.origin + window.location.pathname.replace(/\/$/, "");

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
      loadPath: `${basePath}/locales/{{lng}}/translation.json`
    },
    interpolation: {
      escapeValue: false, // React already escapes content
    },
  });

export default i18n;