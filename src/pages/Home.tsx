import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, Shield, HelpCircle, BookOpen, MessageSquare, Users, ChevronDown, Zap, Instagram, Youtube, Podcast } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import { ContentCardSkeleton } from '../components/Skeleton';
import ScrollReveal from '../components/ScrollReveal';
import { getArticles, type Article } from '../lib/articles';

const steps = [
  {
    icon: <HelpCircle size={24} />,
    title: "1. Browse Your Rights",
    description: "Explore easy-to-understand guides organized by topic — police, tenants, labor, and more.",
  },
  {
    icon: <BookOpen size={24} />,
    title: "2. Read & Understand",
    description: "Each article breaks down the law in plain language, with tips on what to do in real situations.",
  },
  {
    icon: <MessageSquare size={24} />,
    title: "3. Ask a Question",
    description: "Can't find what you're looking for? Submit a question and our team will get you answers.",
  },
];

const topics = [
  { id: "POLICE", label: "Police Encounters", desc: "Know your rights during arrests, searches, and roadblocks.", icon: <Shield size={28} /> },
  { id: "TENANTS", label: "Housing & Tenants", desc: "Eviction rules, landlord obligations, and lease rights.", icon: <Scale size={28} /> },
  { id: "LABOR", label: "Employment & Labor", desc: "Wages, unfair dismissal, maternity leave, and more.", icon: <Users size={28} /> },
  { id: "BUSINESS", label: "Consumer & Business", desc: "Defective goods, refunds, contracts, and small business rights.", icon: <Scale size={28} /> },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getArticles().then((data) => {
      if (!cancelled) {
        setArticles(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <AnimatedPage className="flex-1 flex flex-col">
      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: yBackground }}
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary/8 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[80px]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/5"
          >
            <Zap size={14} className="text-secondary" />
            <span className="text-xs font-heading font-bold text-secondary uppercase tracking-widest">
              Know Your Rights KE
            </span>
          </motion.div>

          <motion.h1
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-on-background">Justice in</span>
            <br />
            <span className="gradient-text">your pocket.</span>
          </motion.h1>

          <motion.p
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed"
          >
            Kenyan law explained in plain language. No jargon, no confusion — just the rights you need to know, when you need them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          >
            <Link
              to="/library"
              className="group px-8 py-3.5 rounded-xl gradient-primary text-secondary font-heading font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2"
            >
              Browse the Library
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/ask"
              className="group px-8 py-3.5 rounded-xl border border-outline text-on-surface-variant hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5 transition-all font-heading font-semibold text-base flex items-center gap-2"
            >
              Ask a Question
              <HelpCircle size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 mt-2"
          >
            {[
              { icon: <span className="font-heading font-bold text-sm">TT</span>, label: "TikTok" },
              { icon: <Instagram size={18} />, label: "Instagram" },
              { icon: <Youtube size={18} />, label: "YouTube" },
              { icon: <Podcast size={18} />, label: "Podcast" },
            ].map((social) => (
              <motion.a
                key={social.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-11 h-11 rounded-xl glass-panel flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary/30 transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-outline flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-2.5 rounded-full bg-secondary/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MISSION ─── */}
      <ScrollReveal>
        <section className="px-4 md:px-8 max-w-5xl mx-auto w-full py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading text-on-background mb-6 leading-tight">
              Law shouldn't be a <span className="gradient-text">secret language</span>
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
              Most Kenyans don't know their legal rights — and that's not their fault. The law is written in dense 
              jargon that's hard to access. We're changing that by breaking down everyday legal situations into 
              clear, actionable guides. Whether you're facing a landlord dispute, a police encounter, or a workplace 
              issue — we've got your back.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* ─── HOW IT WORKS ─── */}
      <ScrollReveal>
        <section className="px-4 md:px-8 max-w-5xl mx-auto w-full py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading text-on-background mb-3">How It Works</h2>
            <p className="text-on-surface-variant text-sm">Three simple steps to know your rights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <TiltCard>
                  <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4 h-full border border-outline">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <div className="text-secondary">{step.icon}</div>
                    </div>
                    <h3 className="font-heading text-xl text-on-background">{step.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{step.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* ─── TOPICS ─── */}
      <ScrollReveal>
        <section className="px-4 md:px-8 max-w-5xl mx-auto w-full py-20 md:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading text-on-background mb-3">Topics We Cover</h2>
            <p className="text-on-surface-variant text-sm">From police encounters to tenant disputes — we've got resources for everyday situations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/library?topic=${topic.id}`}
                  className="group glass-panel rounded-2xl p-6 flex items-start gap-5 border border-outline hover-glow block"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <div className="text-secondary">{topic.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg text-on-background group-hover:text-secondary transition-colors mb-1">
                      {topic.label}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{topic.desc}</p>
                  </div>
                  <ArrowRight size={18} className="text-on-surface-variant group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* ─── FEATURED ARTICLES ─── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading text-on-background mb-3">Featured Guides</h2>
            <p className="text-on-surface-variant text-sm">Quick reads on the most common legal questions.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`skel-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ContentCardSkeleton />
                </motion.div>
              ))
            : articles.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <TiltCard>
                    <Link
                      to={`/article/${item.id}`}
                      className="group glass-panel rounded-2xl overflow-hidden flex flex-col h-full hover-glow block"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => e.currentTarget.setAttribute('data-error', '')}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3">
                          <div className="w-9 h-9 rounded-xl bg-background/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                            {item.type === 'video' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-secondary"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="pill-badge">{item.tag}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5 p-4 flex-1">
                        <h3 className="font-heading text-lg text-on-background group-hover:text-secondary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-1.5 text-secondary/70 group-hover:text-secondary transition-colors mt-auto pt-1">
                          <span className="text-xs font-heading font-semibold">Read more</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
        </div>

        <ScrollReveal>
          <div className="flex justify-center mt-10">
            <Link
              to="/library"
              className="group px-8 py-3 rounded-xl border border-outline text-on-surface-variant hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5 transition-all font-heading font-semibold text-sm flex items-center gap-2"
            >
              View All Guides
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── CTA ─── */}
      <ScrollReveal>
        <section className="px-4 md:px-8 max-w-5xl mx-auto w-full pb-28">
          <div className="glass-panel rounded-3xl p-10 md:p-16 text-center border border-outline relative overflow-hidden">
            <div className="absolute top-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading text-on-background mb-4">
                Still have questions?
              </h2>
              <p className="text-on-surface-variant text-base max-w-lg mx-auto mb-8 leading-relaxed">
                No legal background required. Describe your situation and we'll point you to the facts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/ask"
                  className="group px-8 py-3.5 rounded-xl gradient-primary text-secondary font-heading font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2"
                >
                  Ask a Question
                  <MessageSquare size={18} />
                </Link>
                <Link
                  to="/library"
                  className="group px-8 py-3.5 rounded-xl border border-outline text-on-surface-variant hover:text-secondary hover:border-secondary/30 hover:bg-secondary/5 transition-all font-heading font-semibold text-base flex items-center gap-2"
                >
                  Browse Library
                  <BookOpen size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </AnimatedPage>
  );
}
