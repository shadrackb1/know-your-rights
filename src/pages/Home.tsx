import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, MessageSquare, HelpCircle, Zap, Instagram, Youtube, Podcast } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import ScrollReveal from '../components/ScrollReveal';
import ArticleCard from '../components/ArticleCard';
import { CardSkeleton } from '../components/Skeleton';
import { getArticles, type Article } from '../lib/articles';

const STEPS = [
  { icon: <HelpCircle size={24} />, title: "Browse", desc: "Explore guides organized by topic — police, tenants, labor, business." },
  { icon: <BookOpen size={24} />, title: "Learn", desc: "Each article breaks down the law in plain language with actionable tips." },
  { icon: <MessageSquare size={24} />, title: "Ask", desc: "Can't find your answer? Submit a question and we'll get you answers." },
];

const TOPICS = [
  { id: "POLICE", label: "Police Encounters", desc: "Arrests, searches, roadblocks — know your rights.", icon: <Shield size={24} /> },
  { id: "TENANTS", label: "Housing & Tenants", desc: "Eviction, deposits, rent increases.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: "LABOR", label: "Employment & Labor", desc: "Wages, dismissal, leave, contracts.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id: "BUSINESS", label: "Consumer & Business", desc: "Refunds, licensing, contracts, debt.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getArticles().then((data) => {
      if (!cancelled) { setArticles(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <AnimatedPage className="flex-1 flex flex-col">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background glows */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: yBg }}>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[130px]" />
          <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-secondary/7 blur-[100px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-[90px]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5">
            <Zap size={13} className="text-secondary" />
            <span className="text-xs font-display font-semibold text-secondary uppercase tracking-widest">Know Your Rights KE</span>
          </motion.div>

          <motion.h1 style={{ opacity: opText }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.08] tracking-tight">
            <span className="text-text">Justice in</span><br />
            <span className="gradient-text">your pocket.</span>
          </motion.h1>

          <motion.p style={{ opacity: opText }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-base md:text-lg text-text-muted max-w-lg leading-relaxed">
            Kenyan law explained in plain language. No jargon, no confusion — just the rights you need to know, when you need them.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link to="/library" className="group px-7 py-3 rounded-xl gradient-primary text-secondary font-display font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2">
              Browse Library <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/ask" className="px-7 py-3 rounded-xl border border-border text-text-muted hover:text-secondary hover:border-secondary/30 hover:bg-surface-hover transition-all font-display font-semibold text-sm flex items-center gap-2">
              Ask a Question <HelpCircle size={16} />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 mt-2">
            {[{ i: <span className="font-display font-bold text-sm">TT</span>, l: "TikTok" }, { i: <Instagram size={16} />, l: "Instagram" }, { i: <Youtube size={16} />, l: "YouTube" }, { i: <Podcast size={16} />, l: "Podcast" }].map(s => (
              <a key={s.l} href="#" aria-label={s.l}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-dim hover:text-secondary transition-colors">
                {s.i}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center p-1">
            <motion.div className="w-1 h-2 rounded-full bg-secondary/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MISSION ── */}
      <section className="px-4 md:px-8 max-w-4xl mx-auto w-full py-24 md:py-32">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl md:text-[2.75rem] font-display text-text mb-5 leading-tight">
              Law shouldn't be a <span className="gradient-text">secret language</span>
            </h2>
            <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Most Kenyans don't know their legal rights — and that's not their fault. The law is written in dense
              jargon that's hard to access. We break down everyday legal situations into clear, actionable guides so
              you can protect yourself, your family, and your livelihood.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <div className="divider max-w-2xl mx-auto" />

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto w-full py-24 md:py-32">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-display text-text text-center mb-12">How It Works</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 md:p-7 flex flex-col items-center text-center gap-4 h-full border border-border hover:border-secondary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-secondary shadow-lg shadow-primary/20">
                  {s.icon}
                </div>
                <h3 className="font-display text-lg text-text">{s.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="divider max-w-2xl mx-auto" />

      {/* ── TOPICS ── */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto w-full py-24 md:py-32">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-display text-text text-center mb-12">Topics We Cover</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOPICS.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.08}>
              <Link to={`/library?topic=${t.id.toLowerCase()}`}
                className="group glass rounded-2xl p-5 flex items-start gap-4 border border-border hover:border-secondary/20 transition-all block">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-secondary shrink-0 shadow-lg shadow-primary/20">
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base text-text group-hover:text-secondary transition-colors mb-0.5">{t.label}</h3>
                  <p className="text-text-muted text-sm">{t.desc}</p>
                </div>
                <ArrowRight size={16} className="text-text-dim group-hover:text-secondary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="divider max-w-2xl mx-auto" />

      {/* ── FEATURED ARTICLES ── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-24 md:py-32">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-display text-text text-center mb-12">Featured Guides</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i}><CardSkeleton /></div>)
            : articles.slice(0, 4).map((a, i) => (
                <div key={a.id}>
                  <ArticleCard article={a} index={i} />
                </div>
              ))
          }
        </div>
        <ScrollReveal>
          <div className="flex justify-center mt-10">
            <Link to="/library"
              className="group px-6 py-2.5 rounded-xl border border-border text-text-muted hover:text-secondary hover:border-secondary/30 hover:bg-surface-hover transition-all font-display font-semibold text-sm flex items-center gap-2">
              View All Guides <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto w-full pb-24">
        <ScrollReveal>
          <div className="glass rounded-3xl p-10 md:p-16 text-center border border-border relative overflow-hidden">
            <div className="absolute -top-[30%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-[30%] -right-[10%] w-[350px] h-[350px] rounded-full bg-secondary/6 blur-[70px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-display text-text mb-3">Still have questions?</h2>
              <p className="text-text-muted text-sm max-w-md mx-auto mb-7 leading-relaxed">
                No legal background required. Describe your situation and we'll point you to the facts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/ask"
                  className="group px-7 py-3 rounded-xl gradient-primary text-secondary font-display font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2">
                  Ask a Question <MessageSquare size={16} />
                </Link>
                <Link to="/library"
                  className="px-7 py-3 rounded-xl border border-border text-text-muted hover:text-secondary hover:border-secondary/30 hover:bg-surface-hover transition-all font-display font-semibold text-sm flex items-center gap-2">
                  Browse Library <BookOpen size={16} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </AnimatedPage>
  );
}
