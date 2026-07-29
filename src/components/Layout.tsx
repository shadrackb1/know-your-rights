import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerBg = useTransform(scrollY, [0, 60], ["rgba(10,14,19,0)", "rgba(10,14,19,0.92)"]);
  const headerBlur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(16px)"]);
  const headerBorder = useTransform(scrollY, [0, 60], ["rgba(255,179,0,0)", "rgba(255,179,0,0.1)"]);

  return (
    <div className="min-h-dvh flex flex-col bg-bg text-text">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur, WebkitBackdropFilter: headerBlur, borderBottomColor: headerBorder }}
        className="fixed top-0 inset-x-0 z-50 border-b border-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Scale size={16} className="text-secondary" />
            </div>
            <span className="font-display text-lg font-bold hidden sm:inline">
              KYR <span className="text-secondary">KE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" active={pathname === '/'} />
            <NavLink to="/library" label="Library" active={pathname === '/library' || pathname.startsWith('/article')} />
            <NavLink to="/ask" label="Ask" active={pathname === '/ask'} />
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-text"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg/98 backdrop-blur-xl p-6 flex flex-col gap-2"
          >
            <MobileLink to="/" label="Home" onClick={() => setMenuOpen(false)} />
            <MobileLink to="/library" label="Library" onClick={() => setMenuOpen(false)} />
            <MobileLink to="/ask" label="Ask a Question" onClick={() => setMenuOpen(false)} />
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Scale size={12} className="text-secondary" />
            </div>
            <span className="font-display text-sm font-semibold text-text-muted">KYR KE</span>
          </div>
          <p className="text-text-dim text-xs max-w-sm leading-relaxed">
            Educational resource only. Not formal legal advice. Always consult a licensed advocate for specific matters.
          </p>
          <div className="divider w-40" />
          <p className="text-text-dim text-xs">&copy; 2025 Know Your Rights KE</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-lg font-display text-sm transition-all ${
        active
          ? 'text-secondary bg-secondary/10 font-semibold'
          : 'text-text-muted hover:text-text hover:bg-surface-hover'
      }`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-secondary"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3.5 rounded-xl font-display text-lg text-text-muted hover:text-secondary hover:bg-surface-hover transition-all"
    >
      {label}
    </Link>
  );
}
