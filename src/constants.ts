export const APP_BASENAME = process.env.NODE_ENV === 'production' ? '/vibing-towards-accessibility' : '';

// RTL (Right-to-Left) language configuration
export const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

// Check if a language code is RTL
export const isRTLLanguage = (languageCode: string): boolean => {
  return RTL_LANGUAGES.has(languageCode);
};