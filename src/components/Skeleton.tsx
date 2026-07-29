import TiltCard from './TiltCard';

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ContentCardSkeleton() {
  return (
    <TiltCard>
      <div className="glass-panel rounded-2xl overflow-hidden h-full">
        <div className="relative aspect-[4/3] w-full">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-4/5 h-5" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    </TiltCard>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <TiltCard>
          <div className="glass-panel p-5 rounded-2xl border border-outline flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex flex-col gap-3 items-start flex-1 pr-4 w-full">
              <Skeleton className="w-16 h-5 rounded-full" />
              <div className="w-full max-w-md flex flex-col gap-2">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
            <Skeleton className="hidden sm:block w-10 h-10 rounded-xl shrink-0" />
          </div>
          </TiltCard>
        </div>
      ))}
    </div>
  );
}
