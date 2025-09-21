import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="layout">
      <div className="layout-header">
        {!isHome && (
          <nav className="layout-nav">
            <Link to="/" className="home-link" aria-label={t('layout.backToHome')}>
              {t('layout.home')}
            </Link>
          </nav>
        )}
        <div className="layout-controls">
          <LanguageSwitcher />
        </div>
      </div>
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}