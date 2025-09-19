import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../apps/Calculator';

describe('Calculator', () => {
  it('renders the calculator interface', () => {
    render(<Calculator />);
    
    expect(screen.getByRole('heading', { name: 'Calculator', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Calculation History', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('displays initial value of 0', () => {
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    expect(display).toHaveTextContent('0');
  });

  it('renders all number buttons', () => {
    render(<Calculator />);
    
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `${i} button` })).toBeInTheDocument();
    }
  });

  it('renders all operation buttons', () => {
    render(<Calculator />);
    
    expect(screen.getByRole('button', { name: '+ button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '- button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '× button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '÷ button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '= button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '. button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AC button' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CE button' })).toBeInTheDocument();
  });

  it('updates display when number buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    await user.click(screen.getByRole('button', { name: '5 button' }));
    expect(display).toHaveTextContent('5');
    
    await user.click(screen.getByRole('button', { name: '3 button' }));
    expect(display).toHaveTextContent('53');
  });

  it('performs basic addition', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // 5 + 3 = 8
    await user.click(screen.getByRole('button', { name: '5 button' }));
    await user.click(screen.getByRole('button', { name: '+ button' }));
    await user.click(screen.getByRole('button', { name: '3 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    expect(display).toHaveTextContent('8');
  });

  it('performs basic subtraction', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // 9 - 4 = 5
    await user.click(screen.getByRole('button', { name: '9 button' }));
    await user.click(screen.getByRole('button', { name: '- button' }));
    await user.click(screen.getByRole('button', { name: '4 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    expect(display).toHaveTextContent('5');
  });

  it('performs basic multiplication', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // 6 × 7 = 42
    await user.click(screen.getByRole('button', { name: '6 button' }));
    await user.click(screen.getByRole('button', { name: '× button' }));
    await user.click(screen.getByRole('button', { name: '7 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    expect(display).toHaveTextContent('42');
  });

  it('performs basic division', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // 15 ÷ 3 = 5
    await user.click(screen.getByRole('button', { name: '1 button' }));
    await user.click(screen.getByRole('button', { name: '5 button' }));
    await user.click(screen.getByRole('button', { name: '÷ button' }));
    await user.click(screen.getByRole('button', { name: '3 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    expect(display).toHaveTextContent('5');
  });

  it('adds calculations to history', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    // Perform a calculation
    await user.click(screen.getByRole('button', { name: '5 button' }));
    await user.click(screen.getByRole('button', { name: '+ button' }));
    await user.click(screen.getByRole('button', { name: '3 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    // Check that "No calculations yet" is gone
    expect(screen.queryByText('No calculations yet')).not.toBeInTheDocument();
    
    // Check that the calculation appears in history
    expect(screen.getByText('5 + 3')).toBeInTheDocument();
    
    // Check the result in the history area specifically
    const historySection = screen.getByLabelText('Calculation history');
    expect(historySection).toHaveTextContent('8');
  });

  it('clears display with AC button', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // Enter some numbers
    await user.click(screen.getByRole('button', { name: '1 button' }));
    await user.click(screen.getByRole('button', { name: '2 button' }));
    await user.click(screen.getByRole('button', { name: '3 button' }));
    expect(display).toHaveTextContent('123');
    
    // Clear all
    await user.click(screen.getByRole('button', { name: 'AC button' }));
    expect(display).toHaveTextContent('0');
  });

  it('handles decimal numbers', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Current value/);
    
    // 3.5 + 2.1 = 5.6
    await user.click(screen.getByRole('button', { name: '3 button' }));
    await user.click(screen.getByRole('button', { name: '. button' }));
    await user.click(screen.getByRole('button', { name: '5 button' }));
    await user.click(screen.getByRole('button', { name: '+ button' }));
    await user.click(screen.getByRole('button', { name: '2 button' }));
    await user.click(screen.getByRole('button', { name: '. button' }));
    await user.click(screen.getByRole('button', { name: '1 button' }));
    await user.click(screen.getByRole('button', { name: '= button' }));
    
    expect(display).toHaveTextContent('5.6');
  });

  it('has proper accessibility attributes', () => {
    render(<Calculator />);
    
    // Display should have aria-label
    expect(screen.getByLabelText(/Current value/)).toBeInTheDocument();
    
    // History section should be labeled
    expect(screen.getByLabelText('Calculation history')).toBeInTheDocument();
    
    // All buttons should have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
});