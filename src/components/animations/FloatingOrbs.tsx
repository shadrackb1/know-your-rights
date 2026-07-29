import { motion } from 'motion/react';

interface Orb {
  size: number;
  x: string;
  y: string;
  color: string;
  delay: number;
  duration: number;
}

interface FloatingOrbsProps {
  className?: string;
  count?: number;
}

const COLORS = [
  'rgba(255, 179, 0, 0.08)',
  'rgba(139, 26, 26, 0.06)',
  'rgba(46, 125, 50, 0.05)',
  'rgba(255, 213, 79, 0.06)',
];

export default function FloatingOrbs({ className = '', count = 4 }: FloatingOrbsProps) {
  const orbs: Orb[] = Array.from({ length: count }, (_, i) => ({
    size: 200 + Math.random() * 300,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color: COLORS[i % COLORS.length],
    delay: i * 0.5,
    duration: 15 + Math.random() * 10,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
