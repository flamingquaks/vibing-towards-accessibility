import { Link } from 'react-router-dom';
import './Documentation.css';

export default function Documentation() {
  return (
    <div className="documentation-page">
      <header className="doc-header">
        <h1>Documentation</h1>
        <p>Complete guide to the Accessible App Suite and its features</p>
      </header>

      <main className="doc-content">
        <section className="doc-section">
          <h2>🎯 Project Overview</h2>
          <p>
            The Accessible App Suite is a collection of web applications designed with accessibility as a core principle. 
            Each application demonstrates different accessibility patterns and techniques while providing engaging, 
            functional experiences for all users.
          </p>
          
          <h3>Accessibility Features</h3>
          <ul>
            <li><strong>Keyboard Navigation:</strong> All interactive elements are accessible via keyboard</li>
            <li><strong>Screen Reader Support:</strong> Proper ARIA labels, live regions, and semantic HTML</li>
            <li><strong>High Contrast:</strong> Clear visual hierarchy and sufficient color contrast</li>
            <li><strong>Focus Management:</strong> Visible focus indicators and logical tab order</li>
            <li><strong>Responsive Design:</strong> Works across different screen sizes and devices</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>🧮 Calculator</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                A fully functional calculator with a unique ticker tape style history display. 
                This app demonstrates accessible form controls and live region updates.
              </p>
              
              <h3>Key Features:</h3>
              <ul>
                <li>Standard arithmetic operations (+, -, ×, ÷)</li>
                <li>Ticker tape history showing past calculations</li>
                <li>Clear all (AC) and clear entry (CE) functions</li>
                <li>Decimal number support</li>
              </ul>

              <h3>Accessibility Highlights:</h3>
              <ul>
                <li><strong>Live Region:</strong> Calculator display announces changes to screen readers</li>
                <li><strong>Button Labels:</strong> Each button has descriptive aria-label attributes</li>
                <li><strong>Keyboard Support:</strong> Full keyboard navigation support</li>
                <li><strong>Visual Feedback:</strong> Clear focus indicators and button states</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/calculator" className="doc-app-link">
                🧮 Try Calculator
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>🌈 Rainbow Generator</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                An interactive visual experience that creates bouncing rainbow animations. 
                This app showcases accessible interactive graphics and animation controls.
              </p>
              
              <h3>Key Features:</h3>
              <ul>
                <li>Click or tap to create bouncing rainbows</li>
                <li>Auto-generation mode for continuous rainbow creation</li>
                <li>Physics-based animation with boundary collision</li>
                <li>Real-time rainbow counter</li>
              </ul>

              <h3>Accessibility Highlights:</h3>
              <ul>
                <li><strong>Keyboard Access:</strong> Space/Enter keys create rainbows</li>
                <li><strong>Alternative Controls:</strong> Button controls for users who can't use mouse</li>
                <li><strong>Status Updates:</strong> Live count of active rainbows</li>
                <li><strong>Motion Control:</strong> Clear start/stop controls for auto-generation</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/rainbows" className="doc-app-link">
                🌈 Try Rainbow Generator
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>🃏 Solitaire</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                A classic Klondike Solitaire implementation with full accessibility support. 
                This complex card game demonstrates accessible drag-and-drop alternatives and game state management.
              </p>
              
              <h3>Key Features:</h3>
              <ul>
                <li>Standard Klondike Solitaire rules</li>
                <li>Click-to-select card interaction</li>
                <li>Auto-move to foundation when possible</li>
                <li>Move counter and win detection</li>
                <li>New game functionality</li>
              </ul>

              <h3>Accessibility Highlights:</h3>
              <ul>
                <li><strong>Click Selection:</strong> Alternative to drag-and-drop for card movement</li>
                <li><strong>Card Descriptions:</strong> Cards announced with suit, rank, and color</li>
                <li><strong>Game State:</strong> Move counter and win announcements</li>
                <li><strong>Clear Interactions:</strong> Visual feedback for selected cards</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/solitaire" className="doc-app-link">
                🃏 Try Solitaire
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>🕹️ Arcade Game (Snake)</h2>
          <div className="app-details">
            <div className="app-info">
              <p>
                A modern take on the classic Snake game with comprehensive accessibility features. 
                This real-time game demonstrates accessible gaming patterns and alternative input methods.
              </p>
              
              <h3>Key Features:</h3>
              <ul>
                <li>Classic snake gameplay mechanics</li>
                <li>Progressive difficulty (speed increases with score)</li>
                <li>Score tracking and high score persistence</li>
                <li>Pause/resume functionality</li>
                <li>Game over detection and restart</li>
              </ul>

              <h3>Accessibility Highlights:</h3>
              <ul>
                <li><strong>Multiple Input Methods:</strong> Keyboard (WASD/Arrows) and on-screen buttons</li>
                <li><strong>Game Board Labels:</strong> Proper ARIA labeling for the game area</li>
                <li><strong>Status Information:</strong> Real-time score, length, and high score display</li>
                <li><strong>Clear Instructions:</strong> Built-in how-to-play guide</li>
                <li><strong>Pause Control:</strong> Spacebar to pause/resume for accessibility breaks</li>
              </ul>
            </div>
            <div className="app-link">
              <Link to="/arcade" className="doc-app-link">
                🕹️ Try Arcade Game
              </Link>
            </div>
          </div>
        </section>

        <section className="doc-section">
          <h2>🛠️ Technical Implementation</h2>
          <p>
            This suite is built with modern web technologies and accessibility best practices:
          </p>
          
          <h3>Technology Stack:</h3>
          <ul>
            <li><strong>React 19:</strong> Component-based architecture with hooks</li>
            <li><strong>TypeScript:</strong> Type safety and better development experience</li>
            <li><strong>React Router:</strong> Client-side routing with accessibility support</li>
            <li><strong>Vite:</strong> Fast development and optimized production builds</li>
            <li><strong>CSS3:</strong> Modern styling with responsive design</li>
          </ul>

          <h3>Accessibility Standards:</h3>
          <ul>
            <li>WCAG 2.1 AA compliance guidelines</li>
            <li>Semantic HTML5 elements</li>
            <li>ARIA attributes for enhanced screen reader support</li>
            <li>Keyboard navigation patterns</li>
            <li>Focus management and visual indicators</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>🚀 Getting Started</h2>
          <p>
            Each application in the suite is designed to be intuitive and accessible. Here are some general tips:
          </p>
          
          <ul>
            <li><strong>Navigation:</strong> Use the "← Home" link to return to the main menu</li>
            <li><strong>Keyboard Users:</strong> Tab through interactive elements, use Enter/Space to activate</li>
            <li><strong>Screen Reader Users:</strong> Each app provides live updates and clear labeling</li>
            <li><strong>Mobile Users:</strong> All apps are touch-friendly and responsive</li>
          </ul>

          <div className="getting-started-links">
            <Link to="/" className="doc-home-link">
              ← Back to App Suite
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}