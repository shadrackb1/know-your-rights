import TiltCard from './TiltCard';

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton ${className}`}></div>
  );
}

export function ContentCardSkeleton() {
  return (
    <TiltCard>
      <div className="group glass-panel rounded-2xl p-4 flex flex-col gap-4 block h-full">
        <div className="relative aspect-square w-full">
          <Skeleton className="absolute inset-0 blob-shape border-2 border-outline" />
        </div>
        <div className="flex flex-col gap-3 items-start flex-1 px-2 pb-2 mt-2">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-full h-4 mt-2" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>
    </TiltCard>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map(i => (
        <TiltCard key={i}>
          <div className="glass-panel p-6 rounded-2xl border border-outline flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex flex-col gap-3 items-start flex-1 pr-4 w-full">
              <Skeleton className="w-20 h-6 rounded-full" />
              <div className="w-full max-w-md flex flex-col gap-2 mt-1">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-3/4 h-4 mt-2" />
              </div>
            </div>
            <Skeleton className="hidden sm:block w-8 h-8 rounded-full shrink-0" />
          </div>
        </TiltCard>
      ))}
    </div>
  );
}
