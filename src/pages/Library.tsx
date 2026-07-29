import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import TiltCard from '../components/TiltCard';
import { ArticleListSkeleton } from '../components/Skeleton';
import ScrollReveal from '../components/ScrollReveal';
import { getArticles, type Article } from '../lib/articles';

const topics = ["ALL", "POLICE", "TENANTS", "LABOR", "BUSINESS"];

export default function Library() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("ALL");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const term = search.trim();
    const updated = [
      term,
      ...recentSearches.filter(
        (t) => t.toLowerCase() !== term.toLowerCase()
      ),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = activeTopic === "ALL" || a.tag === activeTopic;
    return matchesSearch && matchesTopic;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-10">
      {/* Search Header */}
      <ScrollReveal>
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-heading text-primary leading-tight">
            Rights Library
          </h1>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search
                className="text-on-surface-variant group-focus-within:text-primary transition-colors"
                size={24}
              />
            </div>
            <input
              type="text"
              placeholder="Search your rights... (Press Enter to save)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-panel border border-outline rounded-2xl py-4 pl-12 pr-4 text-on-background placeholder:text-on-surface-variant input-focus-glow transition-all outline-none"
            />
          </form>
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-[-10px]">
              <span className="text-sm font-heading text-on-surface-variant">
                Recent:
              </span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearch(term)}
                  className="px-3 py-1 rounded-full border border-outline/50 bg-background/50 text-xs text-on-background hover:border-primary hover:text-secondary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Filter Pills */}
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {topics.map((topic) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`shrink-0 px-4 py-2 rounded-full font-heading text-sm uppercase tracking-wide transition-colors border ${
              activeTopic === topic
                ? 'bg-primary border-primary text-secondary'
                : 'bg-transparent border-outline text-on-surface hover:border-primary'
            }`}
          >
            {topic}
          </motion.button>
        ))}
      </div>

      {/* Article List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {loading ? (
          <ArticleListSkeleton />
        ) : filtered.length > 0 ? (
          filtered.map((article) => (
            <motion.div variants={itemVariants} key={article.id}>
              <TiltCard>
                <Link
                  to={`/article/${article.id}`}
                  className="glass-panel p-6 rounded-2xl border border-outline flex flex-col sm:flex-row gap-4 sm:items-center justify-between group block"
                >
                  <div className="flex flex-col gap-3 items-start flex-1 pr-4">
                    <motion.span
                      whileHover={{ y: -2 }}
                      className="pill-badge"
                    >
                      {article.tag}
                    </motion.span>
                    <div>
                      <h3 className="text-xl font-heading text-on-background group-hover:text-secondary transition-colors mb-1">
                        {article.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm line-clamp-2 sm:line-clamp-1">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex text-on-surface-variant group-hover:text-secondary transition-colors shrink-0">
                    <ChevronRight />
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="py-16 flex flex-col items-center text-center glass-panel border border-outline rounded-2xl"
          >
            <h3 className="font-heading text-2xl text-on-background mb-2">
              No results found
            </h3>
            <p className="text-on-surface-variant">
              We couldn't find any articles matching your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveTopic("ALL");
              }}
              className="mt-6 text-primary hover:text-secondary transition-colors underline underline-offset-4"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatedPage>
  );
}
