import { Link } from 'react-router-dom';
import './HomePage.css';

interface AppTile {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
}

const apps: AppTile[] = [
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Complete guide to accessibility features and usage',
    path: '/documentation',
    icon: '📖'
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A calculator with ticker tape style display',
    path: '/calculator',
    icon: '🧮'
  },
  {
    id: 'rainbows',
    title: 'Rainbow Generator',
    description: 'Create bouncing rainbows across the page',
    path: '/rainbows',
    icon: '🌈'
  },
  {
    id: 'solitaire',
    title: 'Solitaire',
    description: 'Classic card game of Solitaire',
    path: '/solitaire',
    icon: '🃏'
  },
  {
    id: 'arcade',
    title: 'Arcade Game',
    description: 'Simple arcade-style game',
    path: '/arcade',
    icon: '🕹️'
  }
];

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Accessible App Suite</h1>
        <p>A collection of accessible and fun applications</p>
      </header>
      
      <main className="apps-grid">
        {apps.map((app) => (
          <Link 
            key={app.id} 
            to={app.path} 
            className="app-tile"
            aria-label={`Open ${app.title}: ${app.description}`}
          >
            <div className="app-icon" aria-hidden="true">{app.icon}</div>
            <h2 className="app-title">{app.title}</h2>
            <p className="app-description">{app.description}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}