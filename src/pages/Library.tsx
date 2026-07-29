import { useState, useEffect, type FormEvent } from 'react';
import { Search, ChevronRight, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
      try { setRecentSearches(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const term = search.trim();
    const updated = [term, ...recentSearches.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = activeTopic === "ALL" || a.tag === activeTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <AnimatedPage className="flex-1 px-4 py-12 md:px-8 max-w-5xl mx-auto w-full flex flex-col gap-10">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen size={20} className="text-secondary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading text-on-background leading-tight">
                Rights Library
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">
                {articles.length} articles on your legal rights
              </p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-on-surface-variant group-focus-within:text-secondary transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search your rights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-panel border border-outline rounded-2xl py-3.5 pl-12 pr-12 text-on-background placeholder:text-on-surface-variant/60 input-focus-glow transition-all outline-none text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-secondary transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </form>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 -mt-4">
              <span className="text-xs text-on-surface-variant/60">Recent:</span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearch(term)}
                  className="px-3 py-1 rounded-full border border-outline bg-surface/50 text-xs text-on-surface-variant hover:border-secondary/30 hover:text-secondary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Filter Pills */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
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

      {/* Article List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="sync">
        {loading ? (
          <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
            <ArticleListSkeleton />
          </motion.div>
        ) : filtered.length > 0 ? (
          filtered.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <TiltCard>
                <Link
                  to={`/article/${article.id}`}
                  className="glass-panel p-5 rounded-2xl border border-outline flex flex-col sm:flex-row gap-4 sm:items-center justify-between group hover-glow block"
                >
                  <div className="flex flex-col gap-2 items-start flex-1 pr-4">
                    <span className="tag-chip">{article.tag}</span>
                    <h3 className="text-lg font-heading text-on-background group-hover:text-secondary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm line-clamp-1">
                      {article.summary}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-xl border border-outline flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:border-secondary/30 group-hover:bg-secondary/5 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center text-center glass-panel rounded-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Search size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-xl text-on-background mb-2">No results found</h3>
            <p className="text-on-surface-variant text-sm">Try different keywords or clear your filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveTopic("ALL"); }}
              className="mt-5 px-5 py-2 rounded-xl bg-secondary/10 text-secondary font-heading text-sm font-semibold border border-secondary/20 hover:bg-secondary/20 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
