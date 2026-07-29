import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import CursorGlow from './CursorGlow';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 80], ["rgba(15, 20, 25, 0)", "rgba(15, 20, 25, 0.95)"]);
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const headerBorder = useTransform(scrollY, [0, 80], ["rgba(255, 179, 0, 0)", "rgba(255, 179, 0, 0.1)"]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background relative overflow-x-hidden">
      <CursorGlow />

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Top App Bar */}
      <motion.header
        style={{
          backgroundColor: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          borderBottomColor: headerBorder,
        }}
        className="fixed top-0 w-full z-50 border-b border-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <Scale size={18} className="text-secondary" />
            </div>
            <span className="font-heading text-xl font-bold text-on-background tracking-wide hidden sm:inline">
              Know Your Rights <span className="text-secondary">KE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" active={path === '/'} />
            <NavLink to="/library" label="Library" active={path === '/library' || path.startsWith('/article')} />
            <NavLink to="/ask" label="Ask a Question" active={path === '/ask'} />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-background p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 top-16 z-40 bg-background/98 backdrop-blur-xl flex flex-col p-6 gap-2"
          >
            <MobileNavLink to="/" label="Home" active={path === '/'} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/library" label="Library" active={path === '/library' || path.startsWith('/article')} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/ask" label="Ask a Question" active={path === '/ask'} onClick={() => setIsMenuOpen(false)} />
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-outline mt-16 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Scale size={14} className="text-secondary" />
            </div>
            <span className="font-heading text-sm font-bold text-on-surface-variant">
              Know Your Rights KE
            </span>
          </div>
          <p className="text-on-surface-variant/60 text-xs text-center max-w-md">
            Educational resource only. Not formal legal advice. Always consult a licensed advocate for specific legal matters.
          </p>
          <div className="section-divider w-48" />
          <p className="text-on-surface-variant/40 text-xs">
            &copy; 2026 Know Your Rights KE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-xl font-heading text-sm transition-all duration-200 ${
        active
          ? 'text-secondary bg-secondary/10'
          : 'text-on-surface-variant hover:text-on-background hover:bg-surface'
      }`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-secondary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, label, active, onClick }: { to: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-5 py-4 rounded-2xl font-heading text-lg transition-all ${
        active
          ? 'bg-secondary/10 text-secondary border border-secondary/20'
          : 'text-on-surface-variant hover:bg-surface hover:text-on-background border border-transparent'
      }`}
    >
      {label}
    </Link>
  );
}
