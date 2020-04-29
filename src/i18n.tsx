import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import deTranslation from './assets/i18n/de/translation.json';
import enTranslation from './assets/i18n/en/translation.json';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector) // Use browser language detection
    .init({
      debug: true,
      resources,
      fallbackLng: 'de', // Fallback to german

      load: 'languageOnly',

      whitelist: ['de', 'en'], // Allowed languages are german and english

      interpolation: {
        escapeValue: false, // react already safes from xss
      },

      react: {
        wait: true,
      },
    });

export default i18n;
