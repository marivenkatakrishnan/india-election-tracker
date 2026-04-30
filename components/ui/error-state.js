export function ErrorState({ title = "Data unavailable", description }) {
  return (
    <div className="rounded-[2rem] border border-amber-300 bg-amber-50 p-6 text-slate-800 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Fallback UI</p>
      <h3 className="mt-3 font-serif text-2xl">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
        {description || "We could not load live data right now. Please try again in a moment."}
      </p>
    </div>
  );
}
