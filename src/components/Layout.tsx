import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="layout">
      {!isHome && (
        <nav className="layout-nav">
          <Link to="/" className="home-link" aria-label="Return to home page">
            ← Home
          </Link>
        </nav>
      )}
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}