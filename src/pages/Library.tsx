import { useState, useEffect, type FormEvent } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedPage from '../components/AnimatedPage';
import ScrollReveal from '../components/ScrollReveal';
import { ArticleListRow } from '../components/ArticleCard';
import { ListSkeleton } from '../components/Skeleton';
import { getArticles, type Article } from '../lib/articles';

const TOPICS = ["ALL", "POLICE", "TENANTS", "LABOR", "BUSINESS"];

export default function Library() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('topic')?.toUpperCase();
  const validInitial = TOPICS.includes(initial || '') ? initial! : "ALL";

  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState(validInitial);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getArticles().then((d) => { if (!cancelled) { setArticles(d); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kyr-recent');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;
    const updated = [term, ...recentSearches.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try { localStorage.setItem('kyr-recent', JSON.stringify(updated)); } catch {}
  };

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchTopic = activeTopic === "ALL" || a.tag === activeTopic;
    return matchSearch && matchTopic;
  });

  const setTopic = (t: string) => {
    setActiveTopic(t);
    setParams(t === "ALL" ? {} : { topic: t.toLowerCase() });
  };

  return (
    <AnimatedPage className="flex-1 px-4 py-10 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <BookOpen size={18} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display text-text leading-tight">Rights Library</h1>
            <p className="text-text-muted text-sm mt-0.5">{articles.length} articles on your legal rights</p>
          </div>
        </div>

        <form onSubmit={submitSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-secondary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search your rights..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass border border-border rounded-xl py-3 pl-11 pr-10 text-text placeholder:text-text-dim focus:outline-none focus:border-secondary/40 focus:shadow-[0_0_20px_rgba(255,179,0,0.08)] transition-all text-sm"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-dim hover:text-secondary transition-colors">
              <X size={16} />
            </button>
          )}
        </form>

        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-text-dim">Recent:</span>
            {recentSearches.map((term, i) => (
              <button key={i} onClick={() => setSearch(term)}
                className="px-2.5 py-1 rounded-lg border border-border bg-surface/50 text-xs text-text-muted hover:border-secondary/30 hover:text-secondary transition-colors">
                {term}
              </button>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Topic pills */}
      <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {TOPICS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTopic(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg font-display text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTopic === t
                ? 'bg-secondary text-bg shadow-lg shadow-secondary/15'
                : 'bg-surface text-text-muted border border-border hover:border-secondary/25 hover:text-text'
            }`}>
            {t}
          </motion.button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="sync">
          {loading ? (
            <motion.div key="skel" exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <ListSkeleton />
            </motion.div>
          ) : filtered.length > 0 ? (
            filtered.map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <ArticleListRow article={article} />
              </motion.div>
            ))
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-16 flex flex-col items-center text-center glass rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Search size={20} className="text-primary" />
              </div>
              <h3 className="font-display text-lg text-text mb-1">No results found</h3>
              <p className="text-text-muted text-sm">Try different keywords or clear your filters.</p>
              <button onClick={() => { setSearch(""); setTopic("ALL"); }}
                className="mt-4 px-5 py-2 rounded-xl bg-secondary/10 text-secondary font-display text-sm font-semibold border border-secondary/20 hover:bg-secondary/15 transition-colors">
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
}
