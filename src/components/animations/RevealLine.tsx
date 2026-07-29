import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface RevealLineProps {
  className?: string;
  color?: string;
  delay?: number;
  width?: string;
}

export default function RevealLine({
  className = '',
  color = '#FFB300',
  delay = 0,
  width = '80px',
}: RevealLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-[2px] rounded-full"
        style={{ background: color, width }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
