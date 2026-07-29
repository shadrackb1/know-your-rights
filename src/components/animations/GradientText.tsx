import type { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export default function GradientText({
  children,
  className = '',
  from = '#FFB300',
  via = '#FFD54F',
  to = '#FFB300',
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`,
        backgroundSize: animate ? '200% 100%' : '100% 100%',
        animation: animate ? 'gradient-shift 3s ease infinite' : 'none',
      }}
    >
      {children}
    </span>
  );
}
