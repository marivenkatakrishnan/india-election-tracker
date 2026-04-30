import { formatDate, formatRelativeTime } from "@/lib/format";
import { ErrorState } from "@/components/ui/error-state";

export function NewsGrid({ articles, error }) {
  if (!articles.length) {
    return (
      <ErrorState
        title="Data unavailable"
        description={error || "No structured headlines were returned by the news API."}
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article.id}
          className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_80px_rgba(15,61,62,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(15,61,62,0.14)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
          </div>

          <div className="space-y-4 p-6">
            <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#0f3d3e]">
              <span>{article.source}</span>
              <span className="text-slate-400">•</span>
              <span title={formatDate(article.publishedAt)}>{formatRelativeTime(article.publishedAt)}</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl leading-tight text-slate-900">{article.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {article.description || "Open the story to read the latest election context."}
              </p>
            </div>

            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#0f3d3e] hover:bg-[#0f3d3e] hover:text-white"
            >
              Read full story
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
