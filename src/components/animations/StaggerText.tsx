import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface StaggerTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export default function StaggerText({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
}: StaggerTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block">
          {word.split('').map((char, ci) => {
            const globalIndex = words.slice(0, wi).join(' ').length + ci;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: 40, opacity: 0, rotateX: -90 }}
                animate={inView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{
                  delay: delay + globalIndex * staggerDelay,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
