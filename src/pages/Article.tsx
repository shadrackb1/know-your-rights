import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Share2, Scale } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import { getArticleById, getArticles, type Article } from '../lib/articles';
import {
  FloatingOrbs,
  GradientText,
  StaggerText,
  RevealLine,
  ElectricBorder,
  GlowCard,
} from '../components/animations';

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getArticleById(id), getArticles()]).then(([art, all]) => {
      if (cancelled) return;
      setArticle(art);
      setRelated(all.filter(a => a.id !== id).slice(0, 4));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="skeleton w-28 h-7 rounded-full" />
          <div className="skeleton w-3/4 h-10" />
          <div className="skeleton w-full aspect-video rounded-2xl" />
          <div className="flex flex-col gap-4">
            <div className="skeleton w-full h-28 rounded-xl" />
            <div className="skeleton w-full h-28 rounded-xl" />
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!article) {
    return (
      <AnimatedPage className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Scale size={24} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl text-text">Article not found</h2>
          <Link to="/library" className="flex items-center gap-1.5 text-secondary hover:text-secondary-light font-display text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Library
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex-1 px-4 py-8 md:py-12 md:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 relative">
      <FloatingOrbs count={3} />

      {/* Reading progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-primary/20 origin-left z-[60]" style={{ scaleX }}>
        <div className="h-full bg-gradient-to-r from-secondary to-accent-light" />
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm relative z-10">
        <Link to="/library" className="text-text-muted hover:text-secondary transition-colors flex items-center gap-1">
          <ArrowLeft size={13} /> Library
        </Link>
        <span className="text-text-dim">/</span>
        <span className="text-text-dim">{article.tag}</span>
      </div>

      {/* Header */}
      <article className="flex flex-col gap-5 relative z-10">
        <RevealLine className="mb-1" />
        <div className="flex items-center gap-2">
          <span className="pill">{article.tag}</span>
          <span className="tag">{article.type}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-display text-text leading-tight"
        >
          <StaggerText text={article.title} staggerDelay={0.02} />
        </motion.h1>

        {article.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full aspect-video rounded-2xl overflow-hidden border border-border relative bg-white/[0.02]"
          >
            {article.type === 'video' ? (
              <div className="absolute inset-0 group cursor-pointer">
                <img src={article.imageUrl} alt={article.title}
                  onError={(e) => e.currentTarget.setAttribute('data-error', '')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-2xl shadow-primary/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-secondary ml-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </motion.div>
                </div>
              </div>
            ) : (
              <img src={article.imageUrl} alt={article.title}
                onError={(e) => e.currentTarget.setAttribute('data-error', '')}
                className="w-full h-full object-cover" />
            )}
          </motion.div>
        )}
      </article>

      {/* Body */}
      <div className="flex flex-col gap-6 relative z-10">
        <ScrollReveal>
          <GlowCard className="glass p-6 md:p-7 rounded-2xl" glowColor="rgba(255, 179, 0, 0.08)">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-secondary" />
              <h2 className="font-display text-lg text-secondary">What the law says</h2>
            </div>
            <p className="text-text-muted leading-relaxed text-[15px]">{article.description}</p>
          </GlowCard>
        </ScrollReveal>

        <ScrollReveal>
          <GlowCard className="glass p-6 md:p-7 rounded-2xl" glowColor="rgba(46, 125, 50, 0.08)">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-accent" />
              <h2 className="font-display text-lg text-accent-light">What this means for you</h2>
            </div>
            <p className="text-text-muted leading-relaxed text-[15px] mb-5">{article.summary}</p>
            <ul className="space-y-2.5">
              {["Always demand a formal written notice before acknowledging any changes.",
                "Document all communications in case of a dispute.",
                "Seek legal counsel if your rights are violated."
              ].map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="shrink-0 w-5 h-5 rounded-md bg-secondary/10 border border-secondary/20 flex items-center justify-center mt-0.5">
                    <span className="text-secondary text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-text-muted text-[15px]">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </GlowCard>
        </ScrollReveal>
      </div>

      {/* Share */}
      <ScrollReveal>
        <ElectricBorder className="p-4 glass rounded-xl" color="#FFB300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-text-muted font-display text-sm">Share this resource</span>
            <div className="flex gap-2">
              {["TT", "IG", "YT"].map(l => (
                <motion.button key={l}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg border border-border text-text-dim hover:bg-surface-hover hover:border-secondary/30 hover:text-secondary transition-all flex items-center justify-center font-display text-[10px] font-bold">
                  {l}
                </motion.button>
              ))}
            </div>
          </div>
        </ElectricBorder>
      </ScrollReveal>

      {/* Related */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="border-t border-border pt-8 relative z-10">
            <h3 className="font-display text-lg text-text mb-5 flex items-center gap-2">
              <Share2 size={16} className="text-secondary" /> Related
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <TiltCard>
                    <Link to={`/article/${r.id}`}
                      className="group glass block rounded-xl border border-border p-4 hover:border-secondary/20 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="tag mb-2">{r.tag}</span>
                          <h4 className="font-display text-sm text-text group-hover:text-secondary transition-colors mt-1.5 leading-snug">{r.title}</h4>
                          <p className="text-text-dim text-xs mt-1 line-clamp-2">{r.summary}</p>
                        </div>
                        <ArrowRight size={14} className="text-text-dim group-hover:text-secondary transition-colors shrink-0 mt-1" />
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </AnimatedPage>
  );
}
