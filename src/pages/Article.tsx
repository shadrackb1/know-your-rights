import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Share2, Scale } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import { getArticleById, getArticles, type Article } from '../lib/articles';

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
      setRelated(all.filter((a) => a.id !== id).slice(0, 3));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-4xl mx-auto w-full">
        <div className="animate-pulse flex flex-col gap-8">
          <div className="skeleton w-32 h-8 rounded-full" />
          <div className="skeleton w-3/4 h-14" />
          <div className="skeleton w-full aspect-video rounded-3xl" />
          <div className="skeleton w-full h-40" />
        </div>
      </AnimatedPage>
    );
  }

  if (!article) {
    return (
      <AnimatedPage className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Scale size={28} className="text-primary" />
          </div>
          <h2 className="font-heading text-3xl text-on-background">Article not found</h2>
          <Link to="/library" className="flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors font-heading text-sm">
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex-1 px-4 py-8 md:py-12 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 origin-left z-[60]" style={{ scaleX }}>
        <div className="h-full bg-gradient-to-r from-secondary to-accent-light" />
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/library" className="text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> Library
        </Link>
        <span className="text-on-surface-variant/40">/</span>
        <span className="text-on-surface-variant/60">{article.tag}</span>
      </div>

      {/* Article Header */}
      <article className="flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="pill-badge">{article.tag}</span>
          <span className="tag-chip">{article.type}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading text-on-background leading-tight">
          {article.title}
        </h1>

        {article.imageUrl && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden border border-outline relative">
            {article.type === 'video' ? (
              <div className="absolute inset-0 group cursor-pointer">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  onError={(e) => e.currentTarget.setAttribute('data-error', '')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-2xl shadow-primary/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-secondary ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            ) : (
              <img src={article.imageUrl} alt={article.title} onError={(e) => e.currentTarget.setAttribute('data-error', '')} className="w-full h-full object-cover" />
            )}
          </div>
        )}
      </article>

      {/* Article Body */}
      <div className="flex flex-col gap-8">
        <ScrollReveal>
          <section className="glass-panel p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-secondary" />
              <h2 className="text-xl font-heading text-secondary">What the law says</h2>
            </div>
            <p className="text-on-surface leading-relaxed text-[15px]">{article.description}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="glass-panel p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-accent" />
              <h2 className="text-xl font-heading text-accent-light">What this means for you</h2>
            </div>
            <p className="text-on-surface leading-relaxed text-[15px] mb-6">{article.summary}</p>
            <ul className="space-y-3">
              {[
                "Always demand a formal written notice before acknowledging any changes.",
                "Document all communications in case of a dispute.",
                "Seek legal counsel if your rights are violated.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mt-0.5">
                    <span className="text-secondary text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-on-surface text-[15px]">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      </div>

      {/* Share */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
          <span className="text-on-surface font-heading text-sm">Share this resource</span>
          <div className="flex gap-2">
            {["TT", "IG", "YT"].map((label) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl border border-outline text-on-surface-variant hover:bg-secondary/10 hover:border-secondary/30 hover:text-secondary transition-all flex items-center justify-center font-heading text-xs font-bold"
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Related */}
      {related.length > 0 && (
        <ScrollReveal>
          <section className="border-t border-outline pt-10">
            <h3 className="text-xl font-heading text-on-background mb-6 flex items-center gap-2">
              <Share2 size={18} className="text-secondary" />
              Related Knowledge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((rel) => (
                <div key={rel.id}>
                  <TiltCard>
                    <Link
                      to={`/article/${rel.id}`}
                      className="group glass-panel block rounded-2xl border border-outline p-5 hover-glow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="tag-chip mb-2">{rel.tag}</span>
                          <h4 className="text-base font-heading text-on-background group-hover:text-secondary transition-colors mt-2 leading-snug">
                            {rel.title}
                          </h4>
                          <p className="text-on-surface-variant text-xs mt-1 line-clamp-2">{rel.summary}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl border border-outline flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:border-secondary/30 transition-all shrink-0">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </AnimatedPage>
  );
}
