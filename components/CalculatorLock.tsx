
import React, { useState } from 'react';
import { translations } from '../translations';

interface CalculatorLockProps {
  correctPin: string;
  onUnlock: () => void;
  language: 'ar' | 'en';
}

// Fix: Added interface for button structure to satisfy TypeScript compiler
interface CalcButton {
  label: string;
  action: () => void;
  color: string;
  colSpan?: boolean;
}

const CalculatorLock: React.FC<CalculatorLockProps> = ({ correctPin, onUnlock, language }) => {
  const t = translations[language];
  const [display, setDisplay] = useState('');
  const [expression, setExpression] = useState('');

  const handleDigit = (digit: string) => {
    setDisplay(prev => prev === '0' ? digit : prev + digit);
  };

  const handleOperator = (op: string) => {
    setExpression(prev => prev + display + ' ' + op + ' ');
    setDisplay('');
  };

  const handleClear = () => {
    setDisplay('');
    setExpression('');
  };

  const handleEquals = () => {
    // Hidden mechanism: If the display exactly matches the PIN, unlock!
    if (display === correctPin) {
      onUnlock();
      return;
    }

    // Otherwise, perform actual calculation for realism
    try {
      const fullExpr = expression + display;
      // We use a safe eval alternative for simple math
      const result = eval(fullExpr.replace('×', '*').replace('÷', '/'));
      setDisplay(result.toString());
      setExpression('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  // Fix: Typed the buttons array and correctly separated colSpan property
  const buttons: CalcButton[] = [
    { label: 'C', action: handleClear, color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' },
    { label: '±', action: () => {}, color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' },
    { label: '%', action: () => {}, color: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' },
    { label: '÷', action: () => handleOperator('/'), color: 'bg-orange-500 text-white' },
    { label: '7', action: () => handleDigit('7'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '8', action: () => handleDigit('8'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '9', action: () => handleDigit('9'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '×', action: () => handleOperator('*'), color: 'bg-orange-500 text-white' },
    { label: '4', action: () => handleDigit('4'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '5', action: () => handleDigit('5'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '6', action: () => handleDigit('6'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '-', action: () => handleOperator('-'), color: 'bg-orange-500 text-white' },
    { label: '1', action: () => handleDigit('1'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '2', action: () => handleDigit('2'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '3', action: () => handleDigit('3'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '+', action: () => handleOperator('+'), color: 'bg-orange-500 text-white' },
    { label: '0', action: () => handleDigit('0'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white', colSpan: true },
    { label: '.', action: () => handleDigit('.'), color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' },
    { label: '=', action: handleEquals, color: 'bg-orange-500 text-white' },
  ];

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[999] flex flex-col p-4 font-mono transition-colors">
      <div className="flex-1 flex flex-col justify-end p-6 mb-8">
        <div className="text-slate-400 text-right text-sm h-6 mb-1">{expression}</div>
        <div className="text-slate-800 dark:text-white text-right text-6xl overflow-hidden truncate">
          {display || '0'}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto w-full pb-8">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`${btn.color} ${btn.colSpan ? 'col-span-2' : ''} h-16 md:h-20 rounded-full text-xl font-bold active:scale-95 transition-all shadow-sm flex items-center justify-center`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorLock;
