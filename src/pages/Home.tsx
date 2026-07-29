import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Podcast, Video, ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import { ContentCardSkeleton } from '../components/Skeleton';
import ScrollReveal from '../components/ScrollReveal';
import { getArticles, type Article } from '../lib/articles';

const topics = ["ALL", "POLICE", "TENANTS", "LABOR", "BUSINESS"];

export default function Home() {
  const [activeTopic, setActiveTopic] = useState("ALL");
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

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filteredFeed =
    activeTopic === "ALL"
      ? articles
      : articles.filter((item) => item.tag === activeTopic);

  return (
    <AnimatedPage className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        {/* Hero background effects */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: yBackground }}
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/6 blur-[80px]" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/5"
          >
            <Zap size={14} className="text-secondary" />
            <span className="text-xs font-heading font-bold text-secondary uppercase tracking-widest">
              Street-Legal Law Series
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-on-background">Justice in</span>
            <br />
            <span className="gradient-text">your pocket.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed"
          >
            Breaking down everyday Kenyan rights. No jargon, just facts you can use.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
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
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full mb-16">
        {/* Section header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading text-on-background mb-2">
                Latest Rights Updates
              </h2>
              <p className="text-on-surface-variant text-sm">
                Stay informed. Stay protected.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Pills */}
              <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {topics.map((topic) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full font-heading text-xs uppercase tracking-wider transition-all duration-200 ${
                      activeTopic === topic
                        ? 'bg-secondary text-background font-bold shadow-lg shadow-secondary/20'
                        : 'bg-surface text-on-surface-variant border border-outline hover:border-secondary/30 hover:text-on-background'
                    }`}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>

              {/* Sort */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-outline text-on-surface-variant text-xs font-heading hover:border-secondary/30 transition-colors"
              >
                Newest <ChevronDown size={14} />
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="sync">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <ContentCardSkeleton />
                </motion.div>
              ))
            : filteredFeed.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <TiltCard>
                    <Link
                      to={`/article/${item.id}`}
                      className="group glass-panel rounded-2xl overflow-hidden flex flex-col h-full hover-glow block"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => e.currentTarget.setAttribute('data-error', '')}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                        {/* Type indicator */}
                        <div className="absolute top-3 right-3">
                          <div className="w-9 h-9 rounded-xl bg-background/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                            {item.type === 'video' ? (
                              <Video size={16} className="text-secondary" />
                            ) : (
                              <Podcast size={16} className="text-secondary" />
                            )}
                          </div>
                        </div>

                        {/* Tag */}
                        <div className="absolute bottom-3 left-3">
                          <span className="pill-badge">{item.tag}</span>
                        </div>
                      </div>

                      {/* Content */}
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
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {!loading && filteredFeed.length === 0 && (
          <ScrollReveal>
            <div className="py-20 flex flex-col items-center text-center glass-panel rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap size={28} className="text-primary" />
              </div>
              <h3 className="font-heading text-2xl text-on-background mb-2">
                No articles yet
              </h3>
              <p className="text-on-surface-variant max-w-sm">
                Content for this topic is coming soon. Check back later or explore other categories.
              </p>
              <button
                onClick={() => setActiveTopic("ALL")}
                className="mt-6 px-5 py-2.5 rounded-xl bg-secondary/10 text-secondary font-heading text-sm font-semibold border border-secondary/20 hover:bg-secondary/20 transition-colors"
              >
                View All Topics
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>
    </AnimatedPage>
  );
}
