import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Documentation.css';

export default function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="documentation-page">
      <header className="doc-header">
        <h1>{t('documentation.title')}</h1>
        <p>{t('documentation.subtitle')}</p>
      </header>

      <main className="doc-content">
        <section className="doc-section">
          <h2>{t('documentation.getStarted.title')}</h2>
          <p>
            {t('documentation.getStarted.text')}
          </p>
          
          <h3>{t('documentation.getStarted.navigation')}</h3>
          <ul>
            <li>{t('documentation.getStarted.use.keyboard')}</li>
            <li>{t('documentation.getStarted.use.screenReader')}</li>
            <li>{t('documentation.getStarted.use.mobile')}</li>
          </ul>

          <div className="getting-started-links">
            <Link to="/" className="doc-home-link">
              {t('documentation.getStarted.backToHome')}
            </Link>
          </div>
        </section>

        <section className="doc-section">
          <h2>{t('documentation.calculator.title')}</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                {t('documentation.calculator.description')}
              </p>
              
              <h3>{t('documentation.calculator.keyFeatures')}</h3>
              <ul>
                <li>{t('documentation.calculator.features.basicOps')}</li>
                <li>{t('documentation.calculator.features.history')}</li>
                <li>{t('documentation.calculator.features.keyboard')}</li>
                <li>{t('documentation.calculator.features.clear')}</li>
              </ul>

              <h3>{t('documentation.calculator.accessibility')}</h3>
              <ul>
                <li>{t('documentation.calculator.accessibilityFeatures.keyboard')}</li>
                <li>{t('documentation.calculator.accessibilityFeatures.visual')}</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/calculator" className="doc-app-link">
                {t('documentation.calculator.tryApp')}
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>{t('documentation.rainbowGenerator.title')}</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                {t('documentation.rainbowGenerator.description')}
              </p>
              
              <h3>{t('documentation.rainbowGenerator.keyFeatures')}</h3>
              <ul>
                <li>{t('documentation.rainbowGenerator.features.click')}</li>
                <li>{t('documentation.rainbowGenerator.features.auto')}</li>
                <li>{t('documentation.rainbowGenerator.features.physics')}</li>
                <li>{t('documentation.rainbowGenerator.features.counter')}</li>
              </ul>

              <h3>{t('documentation.rainbowGenerator.accessibility')}</h3>
              <ul>
                <li>{t('documentation.rainbowGenerator.accessibilityFeatures.keyboard')}</li>
                <li>{t('documentation.rainbowGenerator.accessibilityFeatures.controls')}</li>
                <li>{t('documentation.rainbowGenerator.accessibilityFeatures.status')}</li>
                <li>{t('documentation.rainbowGenerator.accessibilityFeatures.motion')}</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/rainbows" className="doc-app-link">
                {t('documentation.rainbowGenerator.tryApp')}
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>{t('documentation.solitaire.title')}</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                {t('documentation.solitaire.description')}
              </p>
              
              <h3>{t('documentation.solitaire.keyFeatures')}</h3>
              <ul>
                <li>{t('documentation.solitaire.features.klondike')}</li>
                <li>{t('documentation.solitaire.features.click')}</li>
                <li>{t('documentation.solitaire.features.auto')}</li>
                <li>{t('documentation.solitaire.features.undo')}</li>
              </ul>

              <h3>{t('documentation.solitaire.accessibility')}</h3>
              <ul>
                <li>{t('documentation.solitaire.accessibilityFeatures.click')}</li>
                <li>{t('documentation.solitaire.accessibilityFeatures.clear')}</li>
                <li>{t('documentation.solitaire.accessibilityFeatures.state')}</li>
                <li>{t('documentation.solitaire.accessibilityFeatures.keyboard')}</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/solitaire" className="doc-app-link">
                {t('documentation.solitaire.tryApp')}
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>{t('documentation.arcade.title')}</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                {t('documentation.arcade.description')}
              </p>
              
              <h3>{t('documentation.arcade.keyFeatures')}</h3>
              <ul>
                <li>{t('documentation.arcade.features.snake')}</li>
                <li>{t('documentation.arcade.features.keyboard')}</li>
                <li>{t('documentation.arcade.features.score')}</li>
                <li>{t('documentation.arcade.features.pause')}</li>
              </ul>

              <h3>{t('documentation.arcade.accessibility')}</h3>
              <ul>
                <li>{t('documentation.arcade.accessibilityFeatures.keyboard')}</li>
                <li>{t('documentation.arcade.accessibilityFeatures.buttons')}</li>
                <li>{t('documentation.arcade.accessibilityFeatures.status')}</li>
                <li>{t('documentation.arcade.accessibilityFeatures.pause')}</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/arcade" className="doc-app-link">
                {t('documentation.arcade.tryApp')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}