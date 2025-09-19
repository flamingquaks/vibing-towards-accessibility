import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArcadeGame from '../apps/ArcadeGame';

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

describe('ArcadeGame', () => {
  it('renders the arcade game interface', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByRole('heading', { name: '🐍 Snake Game', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('application', { name: 'Snake game board' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '▶️ Start Game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '🔄 Reset' })).toBeInTheDocument();
  });

  it('displays initial game stats', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByText('Score:')).toBeInTheDocument();
    expect(screen.getByText('High Score:')).toBeInTheDocument();
    expect(screen.getByText('Length:')).toBeInTheDocument();
    
    // Check specific score values more carefully
    const scoreElements = screen.getAllByText('0');
    expect(scoreElements.length).toBeGreaterThanOrEqual(2); // Score and High Score
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Initial snake length
  });

  it('renders control buttons', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByRole('button', { name: 'Move up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move down' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move right' })).toBeInTheDocument();
  });

  it('control buttons are disabled initially', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByRole('button', { name: 'Move up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move down' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled();
  });

  it('renders game instructions', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByRole('heading', { name: 'How to Play:', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Use arrow keys or WASD to move')).toBeInTheDocument();
    expect(screen.getByText('Eat the red food to grow and score points')).toBeInTheDocument();
    expect(screen.getByText("Don't hit the walls or yourself")).toBeInTheDocument();
    expect(screen.getByText('Press Space to pause/start')).toBeInTheDocument();
    expect(screen.getByText('Game gets faster as you score more!')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ArcadeGame />);
    
    // Game board should be labeled
    expect(screen.getByRole('application', { name: 'Snake game board' })).toBeInTheDocument();
    
    // All buttons should have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
    
    // Instructions should be in a list
    expect(screen.getByRole('list')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(5);
  });

  it('displays snake length correctly', () => {
    render(<ArcadeGame />);
    
    expect(screen.getByText('Length:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Initial snake length
  });
});