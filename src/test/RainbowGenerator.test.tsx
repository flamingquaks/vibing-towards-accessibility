import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RainbowGenerator from '../apps/RainbowGenerator';

// Mock requestAnimationFrame and cancelAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: vi.fn((cb) => {
    return setTimeout(cb, 16); // ~60fps
  })
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: vi.fn((id) => {
    clearTimeout(id);
  })
});

describe('RainbowGenerator', () => {
  it('renders the rainbow generator interface', () => {
    render(<RainbowGenerator />);
    
    expect(screen.getByRole('heading', { name: 'Rainbow Generator', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Rainbow' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Auto' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument();
  });

  it('displays initial state correctly', () => {
    render(<RainbowGenerator />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Rainbow count
    expect(screen.getByText('Manual mode')).toBeInTheDocument();
    expect(screen.getByText('Click here or use the buttons above to create bouncing rainbows!')).toBeInTheDocument();
  });

  it('adds a rainbow when Add Rainbow button is clicked', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    const addButton = screen.getByRole('button', { name: 'Add Rainbow' });
    await user.click(addButton);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Updated count
    
    // The empty state message should be gone
    expect(screen.queryByText('Click here or use the buttons above to create bouncing rainbows!')).not.toBeInTheDocument();
  });

  it('adds multiple rainbows when button is clicked multiple times', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    const addButton = screen.getByRole('button', { name: 'Add Rainbow' });
    
    await user.click(addButton);
    expect(screen.getByText('1')).toBeInTheDocument();
    
    await user.click(addButton);
    expect(screen.getByText('2')).toBeInTheDocument();
    
    await user.click(addButton);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('clears all rainbows when Clear All button is clicked', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    // Add some rainbows first
    const addButton = screen.getByRole('button', { name: 'Add Rainbow' });
    await user.click(addButton);
    await user.click(addButton);
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Clear all
    const clearButton = screen.getByRole('button', { name: 'Clear All' });
    await user.click(clearButton);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Click here or use the buttons above to create bouncing rainbows!')).toBeInTheDocument();
  });

  it('toggles auto-generation mode', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    const autoButton = screen.getByRole('button', { name: 'Start Auto' });
    
    // Start auto-generation
    await user.click(autoButton);
    expect(screen.getByText('Auto-generating')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop generating rainbows' })).toBeInTheDocument();
    
    // Stop auto-generation
    const stopButton = screen.getByRole('button', { name: 'Stop generating rainbows' });
    await user.click(stopButton);
    expect(screen.getByText('Manual mode')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Auto' })).toBeInTheDocument();
  });

  it('adds rainbow when clicking on the playground area', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    const playground = screen.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    await user.click(playground);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('supports keyboard interaction on playground', async () => {
    const user = userEvent.setup();
    render(<RainbowGenerator />);
    
    const playground = screen.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    
    // Focus and press Enter
    playground.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Press Space
    await user.keyboard(' ');
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<RainbowGenerator />);
    
    // Playground should be accessible
    const playground = screen.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    expect(playground).toHaveAttribute('tabIndex', '0');
    
    // All buttons should have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
    
    // Status information should be accessible
    expect(screen.getByText(/Rainbows active:/)).toBeInTheDocument();
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
  });

  it('displays instruction text correctly', () => {
    render(<RainbowGenerator />);
    
    expect(screen.getByText('Click anywhere in the area below to create a rainbow, or use the buttons above!')).toBeInTheDocument();
  });
});