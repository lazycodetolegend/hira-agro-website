import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({ value = '', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  const strValue = String(value || '');
  const rawNumberMatch = strValue.replace(/,/g, '').match(/\d+/);
  const targetNumber = rawNumberMatch ? parseInt(rawNumberMatch[0], 10) : 0;
  const hasComma = strValue.includes(',');
  const suffix = strValue.replace(/[\d,]/g, '');

  useEffect(() => {
    if (!isInView || targetNumber === 0) return;

    let start = 0;
    const duration = 1500;
    const steps = 40;
    const increment = targetNumber / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setDisplayValue(targetNumber);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, targetNumber]);

  const formattedNumber = hasComma
    ? displayValue.toLocaleString('en-IN')
    : displayValue;

  return (
    <span ref={ref} className={`font-heading text-4xl md:text-6xl text-forest ${className}`}>
      {isInView ? `${formattedNumber}${suffix}` : `0${suffix}`}
    </span>
  );
};

export default AnimatedCounter;
