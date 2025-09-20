import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Calculator.css';

interface CalculationStep {
  expression: string;
  result: string;
}

interface ButtonConfig {
  text?: string;
  textKey?: string;
  action: () => void;
  className: string;
  span?: string;
  ariaKey: string;
  ariaParams?: Record<string, string>;
}

export default function Calculator() {
  const { t } = useTranslation();
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

  const buttons: ButtonConfig[] = [
    { textKey: 'calculator.buttons.clearText', action: clearAll, className: 'clear', ariaKey: 'calculator.buttons.clear' },
    { textKey: 'calculator.buttons.clearEntryText', action: clearEntry, className: 'clear', ariaKey: 'calculator.buttons.clearEntry' },
    { text: '÷', action: () => inputOperation('÷'), className: 'operator', ariaKey: 'calculator.buttons.divide' },
    { text: '×', action: () => inputOperation('×'), className: 'operator', ariaKey: 'calculator.buttons.multiply' },
    { text: '7', action: () => inputNumber('7'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '7' } },
    { text: '8', action: () => inputNumber('8'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '8' } },
    { text: '9', action: () => inputNumber('9'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '9' } },
    { text: '-', action: () => inputOperation('-'), className: 'operator', ariaKey: 'calculator.buttons.subtract' },
    { text: '4', action: () => inputNumber('4'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '4' } },
    { text: '5', action: () => inputNumber('5'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '5' } },
    { text: '6', action: () => inputNumber('6'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '6' } },
    { text: '+', action: () => inputOperation('+'), className: 'operator', ariaKey: 'calculator.buttons.add' },
    { text: '1', action: () => inputNumber('1'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '1' } },
    { text: '2', action: () => inputNumber('2'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '2' } },
    { text: '3', action: () => inputNumber('3'), className: 'number', ariaKey: 'calculator.buttons.number', ariaParams: { number: '3' } },
    { text: '=', action: performCalculation, className: 'equals', span: 'row', ariaKey: 'calculator.buttons.equals' },
    { text: '0', action: () => inputNumber('0'), className: 'number', span: 'wide', ariaKey: 'calculator.buttons.number', ariaParams: { number: '0' } },
    { text: '.', action: inputDecimal, className: 'number', ariaKey: 'calculator.buttons.decimal' },
  ];

  return (
    <div className="calculator-app">
      <h1>{t('calculator.title')}</h1>
      
      <div className="calculator-container">
        <div className="calculator">
          <div className="display">
            <span className="display-value" aria-live="polite" aria-label={`${t('calculator.display')}: ${display}`}>
              {display}
            </span>
          </div>
          
          <div className="buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`calc-button ${button.className} ${button.span || ''}`}
                onClick={button.action}
                aria-label={t(button.ariaKey, button.ariaParams)}
              >
                {button.textKey ? t(button.textKey) : button.text || 'Button'}
              </button>
            ))}
          </div>
        </div>

        <div className="ticker-tape" aria-label={t('calculator.calculationTape')}>
          <h2>{t('calculator.calculationTape')}</h2>
          <div className="tape-container">
            {history.length === 0 ? (
              <p className="no-history">{t('calculator.noHistory')}</p>
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