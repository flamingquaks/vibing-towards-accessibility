import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';

// Helper to wrap components with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders the main heading', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Accessible App Suite', level: 1 })).toBeInTheDocument();
  });

  it('renders the description', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('A collection of accessible and fun applications')).toBeInTheDocument();
  });

  it('renders all app tiles with correct links', () => {
    renderWithRouter(<HomePage />);
    
    // Check Calculator
    const calculatorLink = screen.getByRole('link', { name: /Open Calculator/ });
    expect(calculatorLink).toBeInTheDocument();
    expect(calculatorLink).toHaveAttribute('href', '/calculator');
    
    // Check Rainbow Generator
    const rainbowLink = screen.getByRole('link', { name: /Open Rainbow Generator/ });
    expect(rainbowLink).toBeInTheDocument();
    expect(rainbowLink).toHaveAttribute('href', '/rainbows');
    
    // Check Solitaire
    const solitaireLink = screen.getByRole('link', { name: /Open Solitaire/ });
    expect(solitaireLink).toBeInTheDocument();
    expect(solitaireLink).toHaveAttribute('href', '/solitaire');
    
    // Check Arcade Game
    const arcadeLink = screen.getByRole('link', { name: /Open Arcade Game/ });
    expect(arcadeLink).toBeInTheDocument();
    expect(arcadeLink).toHaveAttribute('href', '/arcade');
  });

  it('renders app titles as h2 headings', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByRole('heading', { name: 'Calculator', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rainbow Generator', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Solitaire', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Arcade Game', level: 2 })).toBeInTheDocument();
  });

  it('renders app descriptions', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('A calculator with ticker tape style display')).toBeInTheDocument();
    expect(screen.getByText('Create bouncing rainbows across the page')).toBeInTheDocument();
    expect(screen.getByText('Classic card game of Solitaire')).toBeInTheDocument();
    expect(screen.getByText('Simple arcade-style game')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<HomePage />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
      
      // Check that icons are hidden from screen readers
      const icon = link.querySelector('.app-icon');
      if (icon) {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });
});