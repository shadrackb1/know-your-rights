import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TiltCard from './TiltCard';
import type { Article } from '../lib/articles';

export default function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <TiltCard>
      <Link
        to={`/article/${article.id}`}
        className="group glass rounded-2xl overflow-hidden flex flex-col h-full block"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/[0.02]">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            onError={(e) => e.currentTarget.setAttribute('data-error', '')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 pill">{article.tag}</span>
          {article.type === 'video' && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-secondary"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          )}
          {article.type === 'podcast' && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3 className="font-display text-[15px] text-text leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
            {article.title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed line-clamp-2 flex-1">
            {article.summary}
          </p>
          <div className="flex items-center gap-1.5 text-secondary/60 group-hover:text-secondary transition-colors mt-1 pt-1">
            <span className="text-xs font-display font-semibold">Read more</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export function ArticleListRow({ article }: { article: Article }) {
  return (
    <TiltCard>
      <Link
        to={`/article/${article.id}`}
        className="glass p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between group block"
      >
        <div className="flex flex-col gap-2 items-start flex-1 min-w-0">
          <span className="tag">{article.tag}</span>
          <h3 className="font-display text-base text-text leading-snug group-hover:text-secondary transition-colors">
            {article.title}
          </h3>
          <p className="text-text-muted text-sm truncate w-full">{article.summary}</p>
        </div>
        <div className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-dim group-hover:text-secondary group-hover:border-secondary/30 transition-all shrink-0">
          <ArrowRight size={16} />
        </div>
      </Link>
    </TiltCard>
  );
}
