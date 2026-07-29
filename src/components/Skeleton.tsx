export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] w-full"><Skeleton className="w-full h-full rounded-none" /></div>
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="w-14 h-4 rounded-full" />
        <Skeleton className="w-4/5 h-5" />
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="flex flex-col gap-3 items-start flex-1">
            <Skeleton className="w-14 h-4 rounded-full" />
            <Skeleton className="w-full max-w-sm h-5" />
            <Skeleton className="w-3/4 h-3" />
          </div>
          <Skeleton className="hidden sm:block w-9 h-9 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
