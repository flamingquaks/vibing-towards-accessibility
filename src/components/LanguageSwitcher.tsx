import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        🌍 {t('languageSwitcher.selectLanguage', 'Language')}
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label={t('languageSwitcher.selectLanguage', 'Select language')}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}