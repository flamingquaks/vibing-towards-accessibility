import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../apps/Calculator';

describe('Calculator', () => {
  it('renders the calculator interface', () => {
    render(<Calculator />);
    
    expect(screen.getByRole('heading', { name: 'Calculator', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Calculation Tape', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('displays initial value of 0', () => {
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: 0/);
    expect(display).toHaveTextContent('0');
  });

  it('renders all number buttons', () => {
    render(<Calculator />);
    
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `Number ${i}` })).toBeInTheDocument();
    }
  });

  it('renders all operation buttons', () => {
    render(<Calculator />);
    
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subtract' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Multiply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Divide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Equals' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decimal point' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear entry' })).toBeInTheDocument();
  });

  it('updates display when number buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    await user.click(screen.getByRole('button', { name: 'Number 5' }));
    expect(display).toHaveTextContent('5');
    
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    expect(display).toHaveTextContent('53');
  });

  it('performs basic addition', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // 5 + 3 = 8
    await user.click(screen.getByRole('button', { name: 'Number 5' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(display).toHaveTextContent('8');
  });

  it('performs basic subtraction', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // 9 - 4 = 5
    await user.click(screen.getByRole('button', { name: 'Number 9' }));
    await user.click(screen.getByRole('button', { name: 'Subtract' }));
    await user.click(screen.getByRole('button', { name: 'Number 4' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(display).toHaveTextContent('5');
  });

  it('performs basic multiplication', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // 6 × 7 = 42
    await user.click(screen.getByRole('button', { name: 'Number 6' }));
    await user.click(screen.getByRole('button', { name: 'Multiply' }));
    await user.click(screen.getByRole('button', { name: 'Number 7' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(display).toHaveTextContent('42');
  });

  it('performs basic division', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // 15 ÷ 3 = 5
    await user.click(screen.getByRole('button', { name: 'Number 1' }));
    await user.click(screen.getByRole('button', { name: 'Number 5' }));
    await user.click(screen.getByRole('button', { name: 'Divide' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(display).toHaveTextContent('5');
  });

  it('adds calculations to history', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    // Perform a calculation
    await user.click(screen.getByRole('button', { name: 'Number 5' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    // Check that "No calculations yet" is gone
    expect(screen.queryByText('No calculations yet')).not.toBeInTheDocument();
    
    // Check that the calculation appears in history
    expect(screen.getByText('5 + 3')).toBeInTheDocument();
    
    // Check the result in the history area specifically
    const historySection = screen.getByLabelText('Calculation Tape');
    expect(historySection).toHaveTextContent('8');
  });

  it('clears display with Clear all', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // Enter some numbers
    await user.click(screen.getByRole('button', { name: 'Number 1' }));
    await user.click(screen.getByRole('button', { name: 'Number 2' }));
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    expect(display).toHaveTextContent('123');
    
    // Clear all
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(display).toHaveTextContent('0');
  });

  it('handles decimal numbers', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    const display = screen.getByLabelText(/Display: /);
    
    // 3.5 + 2.1 = 5.6
    await user.click(screen.getByRole('button', { name: 'Number 3' }));
    await user.click(screen.getByRole('button', { name: 'Decimal point' }));
    await user.click(screen.getByRole('button', { name: 'Number 5' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Number 2' }));
    await user.click(screen.getByRole('button', { name: 'Decimal point' }));
    await user.click(screen.getByRole('button', { name: 'Number 1' }));
    await user.click(screen.getByRole('button', { name: 'Equals' }));
    
    expect(display).toHaveTextContent('5.6');
  });

  it('has proper accessibility attributes', () => {
    render(<Calculator />);
    
    // Display should have aria-label
    expect(screen.getByLabelText(/Display: /)).toBeInTheDocument();
    
    // History section should be labeled
    expect(screen.getByLabelText('Calculation Tape')).toBeInTheDocument();
    
    // All buttons should have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
});