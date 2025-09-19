import { useState } from 'react';
import './Calculator.css';

interface CalculationStep {
  expression: string;
  result: string;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<CalculationStep[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const expression = `${previousValue} ${operation} ${inputValue}`;
      
      setHistory(prev => [...prev, { expression, result: String(newValue) }]);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { text: 'AC', action: clearAll, className: 'clear' },
    { text: 'CE', action: clearEntry, className: 'clear' },
    { text: '÷', action: () => inputOperation('÷'), className: 'operator' },
    { text: '×', action: () => inputOperation('×'), className: 'operator' },
    { text: '7', action: () => inputNumber('7'), className: 'number' },
    { text: '8', action: () => inputNumber('8'), className: 'number' },
    { text: '9', action: () => inputNumber('9'), className: 'number' },
    { text: '-', action: () => inputOperation('-'), className: 'operator' },
    { text: '4', action: () => inputNumber('4'), className: 'number' },
    { text: '5', action: () => inputNumber('5'), className: 'number' },
    { text: '6', action: () => inputNumber('6'), className: 'number' },
    { text: '+', action: () => inputOperation('+'), className: 'operator' },
    { text: '1', action: () => inputNumber('1'), className: 'number' },
    { text: '2', action: () => inputNumber('2'), className: 'number' },
    { text: '3', action: () => inputNumber('3'), className: 'number' },
    { text: '=', action: performCalculation, className: 'equals', span: 'row' },
    { text: '0', action: () => inputNumber('0'), className: 'number', span: 'wide' },
    { text: '.', action: inputDecimal, className: 'number' },
  ];

  return (
    <div className="calculator-app">
      <h1>Calculator</h1>
      
      <div className="calculator-container">
        <div className="calculator">
          <div className="display">
            <span className="display-value" aria-live="polite" aria-label={`Current value: ${display}`}>
              {display}
            </span>
          </div>
          
          <div className="buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`calc-button ${button.className} ${button.span || ''}`}
                onClick={button.action}
                aria-label={`${button.text} button`}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>

        <div className="ticker-tape" aria-label="Calculation history">
          <h2>Calculation History</h2>
          <div className="tape-container">
            {history.length === 0 ? (
              <p className="no-history">No calculations yet</p>
            ) : (
              history.slice(-10).map((step, index) => (
                <div key={index} className="tape-entry" role="listitem">
                  <span className="expression">{step.expression}</span>
                  <span className="equals">=</span>
                  <span className="result">{step.result}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}