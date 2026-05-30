export function SkinCardSkeleton() {
  return (
    <div className="rounded-2xl glass-card overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-5 w-20" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="skeleton h-6 w-6 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-2.5 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkinGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkinCardSkeleton key={i} />
      ))}
    </div>
  );
}
