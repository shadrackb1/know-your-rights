import { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export default function Typewriter({
  text,
  className = '',
  speed = 60,
  delay = 0,
  showCursor = true,
}: TypewriterProps) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || started) return;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [inView, delay, started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplay(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span ref={ref} className={className}>
      {display}
      {showCursor && started && (
        <span className="inline-block w-[2px] h-[1em] bg-secondary ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
