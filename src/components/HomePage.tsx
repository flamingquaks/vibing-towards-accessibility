import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HomePage.css';

interface AppTile {
  id: string;
  titleKey: string;
  descriptionKey: string;
  path: string;
  icon: string;
}

const apps: AppTile[] = [
  {
    id: 'documentation',
    titleKey: 'homepage.apps.documentation.title',
    descriptionKey: 'homepage.apps.documentation.description',
    path: '/documentation',
    icon: '📖'
  },
  {
    id: 'calculator',
    titleKey: 'homepage.apps.calculator.title',
    descriptionKey: 'homepage.apps.calculator.description',
    path: '/calculator',
    icon: '🧮'
  },
  {
    id: 'rainbows',
    titleKey: 'homepage.apps.rainbows.title',
    descriptionKey: 'homepage.apps.rainbows.description',
    path: '/rainbows',
    icon: '🌈'
  },
  {
    id: 'solitaire',
    titleKey: 'homepage.apps.solitaire.title',
    descriptionKey: 'homepage.apps.solitaire.description',
    path: '/solitaire',
    icon: '🃏'
  },
  {
    id: 'arcade',
    titleKey: 'homepage.apps.arcade.title',
    descriptionKey: 'homepage.apps.arcade.description',
    path: '/arcade',
    icon: '🕹️'
  }
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>{t('homepage.title')}</h1>
        <p>{t('homepage.subtitle')}</p>
      </header>
      
      <main className="apps-grid">
        {apps.map((app) => {
          const title = t(app.titleKey);
          const description = t(app.descriptionKey);
          
          return (
            <Link 
              key={app.id} 
              to={app.path} 
              className="app-tile"
              aria-label={t('homepage.openApp', { title, description })}
            >
              <div className="app-icon" aria-hidden="true">{app.icon}</div>
              <h2 className="app-title">{title}</h2>
              <p className="app-description">{description}</p>
            </Link>
          );
        })}
      </main>
    </div>
  );
}