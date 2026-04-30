export function SourceGrid({ title, description, sources }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0f3d3e]">Source list</p>
          <h2 className="mt-2 font-serif text-4xl text-slate-900">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => (
          <article
            key={source.id}
            className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,61,62,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f3d3e]">{source.category}</p>
                <h3 className="mt-2 font-serif text-2xl text-slate-900">{source.name}</h3>
              </div>
              {source.badge ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
                  {source.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">{source.description}</p>

            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#0f3d3e] hover:bg-[#0f3d3e] hover:text-white"
            >
              Open coverage
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
