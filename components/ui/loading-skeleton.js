function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-3xl bg-slate-200/80 ${className}`} />;
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </section>
    </div>
  );
}
