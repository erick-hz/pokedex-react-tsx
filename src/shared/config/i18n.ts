import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@shared/locales/en.json';
import es from '@shared/locales/es.json';
import ja from '@shared/locales/ja.json';

const savedLanguage =
  typeof window !== 'undefined' ? window.localStorage.getItem('language') : null;

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ja: { translation: ja },
  },
  lng: savedLanguage ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
