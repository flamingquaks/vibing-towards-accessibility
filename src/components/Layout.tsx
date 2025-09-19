import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
      {!isHome && (
        <nav className="layout-nav">
          <Link to="/" className="home-link" aria-label={t('layout.backToHome')}>
            ← {t('layout.home')}
          </Link>
        </nav>
      )}
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}