import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

interface ElectricBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  borderWidth?: number;
}

export default function ElectricBorder({
  children,
  className = '',
  color = '#FFB300',
  borderWidth = 2,
}: ElectricBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: borderWidth,
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${color}40, transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />
      {/* Spark effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePos.x - 4,
            top: mousePos.y - 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.4 }}
          key={`${mousePos.x}-${mousePos.y}`}
        />
      )}
      {children}
    </div>
  );
}
