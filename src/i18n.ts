import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { isRTLLanguage } from './constants';
import en from './locales/en.json';
import es from './locales/es.json';
import ar from './locales/ar.json';

// Available languages
const resources = {
  en: { translation: en },
  es: { translation: es },
  ar: { translation: ar }
};

// Get saved language from localStorage or default to English
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

// Save language preference and update HTML dir attribute when language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  
  // Update HTML dir attribute for RTL support
  const htmlElement = document.documentElement;
  if (isRTLLanguage(lng)) {
    htmlElement.setAttribute('dir', 'rtl');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
  }
});

// Set initial dir attribute
const initialLanguage = i18n.language || savedLanguage;
if (isRTLLanguage(initialLanguage)) {
  document.documentElement.setAttribute('dir', 'rtl');
} else {
  document.documentElement.setAttribute('dir', 'ltr');
}

export default i18n;

// Export available languages for the language switcher
export const availableLanguages = Object.keys(resources);