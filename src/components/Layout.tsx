import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import CursorGlow from './CursorGlow';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const headerBackground = useTransform(scrollY, [0, 100], ["rgba(122, 35, 49, 0.05)", "rgba(122, 35, 49, 0.4)"]);
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(122, 35, 49, 0)", "rgba(122, 35, 49, 0.3)"]);
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(8px)", "blur(16px)"]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background relative overflow-x-hidden">
      <CursorGlow />
      {/* Top App Bar */}
      <motion.header 
        style={{
          height: headerHeight,
          backgroundColor: headerBackground,
          borderColor: headerBorder,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur
        }}
        className="fixed top-0 w-full z-50 border-b flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold text-primary tracking-wide">
            Know Your Rights KE
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
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
      {isMenuOpen && (
        <nav className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md flex flex-col p-6 gap-4">
          <MobileNavLink to="/" label="Home" active={path === '/'} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/library" label="Library" active={path === '/library' || path.startsWith('/article')} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink to="/ask" label="Ask a Question" active={path === '/ask'} onClick={() => setIsMenuOpen(false)} />
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/30 mt-12 py-8 text-center text-on-surface-variant text-sm px-4">
        <p>© 2026 Know Your Rights KE. Not formal legal advice.</p>
      </footer>
    </div>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`font-heading text-lg transition-colors inline-block ${
          active
            ? 'text-secondary'
            : 'text-on-background hover:text-secondary'
        }`}
      >
        {label}
      </Link>
    </motion.div>
  );
}

function MobileNavLink({ to, label, active, onClick }: { to: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-4 rounded-xl font-heading text-xl transition-colors ${
        active ? 'bg-primary/20 text-secondary' : 'text-on-background hover:bg-surface'
      }`}
    >
      {label}
    </Link>
  );
}
