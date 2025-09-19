import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Solitaire from '../apps/Solitaire';

// Mock Math.random for consistent testing
const mockMath = Object.create(Math);
mockMath.random = vi.fn(() => 0.5);
Math.random = mockMath.random;

describe('Solitaire', () => {
  it('renders the solitaire game interface', () => {
    render(<Solitaire />);
    
    expect(screen.getByRole('heading', { name: 'Solitaire', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Game' })).toBeInTheDocument();
    expect(screen.getByText(/Moves:/)).toBeInTheDocument();
  });

  it('displays initial game state', () => {
    render(<Solitaire />);
    
    // Should show 0 moves initially
    expect(screen.getByText('Moves: 0')).toBeInTheDocument();
    
    // Should not show win message initially
    expect(screen.queryByText(/Congratulations/)).not.toBeInTheDocument();
  });

  it('has a new game button', async () => {
    const user = userEvent.setup();
    render(<Solitaire />);
    
    const newGameButton = screen.getByRole('button', { name: 'New Game' });
    expect(newGameButton).toBeInTheDocument();
    
    // Click should reset the game (moves should still be 0)
    await user.click(newGameButton);
    expect(screen.getByText('Moves: 0')).toBeInTheDocument();
  });

  it('renders the game board areas', () => {
    render(<Solitaire />);
    
    // The solitaire board should contain the main game areas
    const solitaireBoard = document.querySelector('.solitaire-board');
    expect(solitaireBoard).toBeInTheDocument();
    
    const topArea = document.querySelector('.top-area');
    expect(topArea).toBeInTheDocument();
    
    const tableauArea = document.querySelector('.tableau');
    expect(tableauArea).toBeInTheDocument();
  });

  it('renders stock and waste piles', () => {
    render(<Solitaire />);
    
    const stockWaste = document.querySelector('.stock-waste');
    expect(stockWaste).toBeInTheDocument();
  });

  it('renders foundation piles', () => {
    render(<Solitaire />);
    
    const foundations = document.querySelector('.foundations');
    expect(foundations).toBeInTheDocument();
  });

  it('renders tableau columns', () => {
    render(<Solitaire />);
    
    const tableau = document.querySelector('.tableau');
    expect(tableau).toBeInTheDocument();
    
    // Should have 7 tableau columns
    const tableauCols = document.querySelectorAll('.tableau-column');
    expect(tableauCols).toHaveLength(7);
  });

  it('has proper game structure with all required areas', () => {
    render(<Solitaire />);
    
    // Header with title and stats
    expect(document.querySelector('.solitaire-header')).toBeInTheDocument();
    expect(document.querySelector('.game-stats')).toBeInTheDocument();
    
    // Main game board
    expect(document.querySelector('.solitaire-board')).toBeInTheDocument();
    
    // Game areas
    expect(document.querySelector('.top-area')).toBeInTheDocument();
    expect(document.querySelector('.stock-waste')).toBeInTheDocument();
    expect(document.querySelector('.foundations')).toBeInTheDocument();
    expect(document.querySelector('.tableau')).toBeInTheDocument();
  });

  it('shows move counter', () => {
    render(<Solitaire />);
    
    expect(screen.getByText(/Moves: \d+/)).toBeInTheDocument();
  });

  it('new game button resets moves to 0', async () => {
    const user = userEvent.setup();
    render(<Solitaire />);
    
    const newGameButton = screen.getByRole('button', { name: 'New Game' });
    await user.click(newGameButton);
    
    expect(screen.getByText('Moves: 0')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<Solitaire />);
    
    // Should have proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Button should be accessible
    expect(screen.getByRole('button', { name: 'New Game' })).toBeInTheDocument();
    
    // Game areas should be properly structured
    expect(document.querySelector('.solitaire-app')).toBeInTheDocument();
  });

  it('does not show win message at start', () => {
    render(<Solitaire />);
    
    expect(screen.queryByText(/🎉.*Congratulations.*🎉/)).not.toBeInTheDocument();
  });

  it('maintains game state structure', () => {
    render(<Solitaire />);
    
    // The component should render without crashing and maintain its structure
    expect(document.querySelector('.solitaire-app')).toBeInTheDocument();
    expect(document.querySelector('.solitaire-header')).toBeInTheDocument();
    expect(document.querySelector('.solitaire-board')).toBeInTheDocument();
    
    // All major game areas should be present
    expect(document.querySelector('.top-area')).toBeInTheDocument();
    expect(document.querySelector('.tableau')).toBeInTheDocument();
  });
});