import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, ArrowRight } from 'lucide-react';
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
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getArticleById(id), getArticles()]).then(([art, all]) => {
      if (cancelled) return;
      setArticle(art);
      setRelated(
        all
          .filter((a) => a.id !== id)
          .slice(0, 2)
      );
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-12">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="skeleton w-24 h-8 rounded-full" />
          <div className="skeleton w-3/4 h-12" />
          <div className="skeleton w-full aspect-video rounded-3xl" />
          <div className="skeleton w-full h-32" />
          <div className="skeleton w-full h-32" />
        </div>
      </AnimatedPage>
    );
  }

  if (!article) {
    return (
      <AnimatedPage className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-3xl text-primary mb-4">
            Article not found
          </h2>
          <Link
            to="/library"
            className="text-secondary hover:text-primary transition-colors underline underline-offset-4"
          >
            Back to Library
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-12">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-secondary origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Header */}
      <article className="flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="pill-badge">{article.tag}</span>
          <Link
            to="/library"
            className="text-sm text-on-surface-variant hover:text-secondary transition-colors"
          >
            Library
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading text-primary leading-tight">
          {article.title}
        </h1>

        {article.type === 'video' && article.imageUrl ? (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 border border-outline glass-panel relative flex items-center justify-center group cursor-pointer hover-glow">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-20 h-20 bg-primary/80 backdrop-blur-md rounded-full flex items-center justify-center border border-outline shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-secondary ml-2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </motion.div>
          </div>
        ) : article.imageUrl ? (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 border border-outline glass-panel relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </article>

      <div className="flex flex-col gap-10">
        <ScrollReveal>
          <section>
            <h2 className="text-2xl font-heading text-secondary mb-4">
              What the law says
            </h2>
            <div className="glass-panel p-6 rounded-2xl border border-outline">
              <p className="text-on-background leading-relaxed">
                {article.description}
              </p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="text-2xl font-heading text-secondary mb-4">
              What this means for you
            </h2>
            <div className="glass-panel p-6 rounded-2xl border border-outline">
              <p className="text-on-background leading-relaxed mb-6">
                {article.summary}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span className="text-on-background">
                    Always demand a formal written notice before acknowledging
                    any changes.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span className="text-on-background">
                    Document all communications in case of a dispute.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-outline mt-4">
          <span className="text-on-surface font-heading">
            Share this resource
          </span>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-outline text-on-surface hover:bg-primary/20 hover:border-primary hover:text-secondary hover-glow transition-colors flex items-center justify-center font-heading text-sm font-bold"
            >
              TT
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-outline text-on-surface hover:bg-primary/20 hover:border-primary hover:text-secondary hover-glow transition-colors flex items-center justify-center font-heading text-sm font-bold"
            >
              IG
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full border border-outline text-on-surface hover:bg-primary/20 hover:border-primary hover:text-secondary hover-glow transition-colors flex items-center justify-center font-heading text-sm font-bold"
            >
              YT
            </motion.button>
          </div>
        </div>
      </ScrollReveal>

      {related.length > 0 && (
        <ScrollReveal>
          <section className="mt-8 border-t border-primary/30 pt-12">
            <h3 className="text-2xl font-heading text-primary mb-6">
              Related Knowledge
            </h3>
            <div className="flex flex-col gap-4">
              {related.map((rel) => (
                <TiltCard key={rel.id}>
                  <Link
                    to={`/article/${rel.id}`}
                    className="group glass-panel block overflow-hidden rounded-2xl border border-outline p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <span className="pill-badge mb-3">{rel.tag}</span>
                        <h4 className="text-xl font-heading text-on-background group-hover:text-secondary transition-colors mb-2">
                          {rel.title}
                        </h4>
                        <p className="text-on-surface-variant text-sm line-clamp-2">
                          {rel.summary}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:border-secondary transition-colors shrink-0">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </AnimatedPage>
  );
}
