

const apps = [
  {
    id: "1",
    name: "Portfolio website",
    status: "PUBLISHED",
    url: "https://intekhabx.vercel",
  },
  {
    id: "2",
    name: "Coffee shop landing",
    status: "DRAFT",
    url: "https://pulse",
  },
  {
    id: "3",
    name: "Resume website",
    status: "DRAFT",
    url: "https://itry-assistant.vercel.app",
  },
] satisfies App[];


interface App {
  id: string;
  name: string;
  status: "PUBLISHED" | "DRAFT";
  url: string;
}


export default function RecentApps() {
  return (
    <section className="max-w-6xl mx-auto space-y-4 px-6 pb-14 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-label">
          Recent apps
        </h2>

        <button
          className="text-xs font-medium text-peach transition-colors hover:text-cream"
        >
          View all
        </button>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <article
            key={app.id}
            // onClick={() => onAppClick?.(app)}
            className="group min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface p-3 shadow-glass transition-all duration-300 hover:border-coral/30"
          >
            {/* Website Preview */}
            <div className="relative h-[150px] w-full overflow-hidden rounded-xl bg-background">
              <iframe
                src={app.url}
                title={`${app.name} preview`}
                loading="lazy"
                scrolling="no"
                className="absolute inset-0 h-full w-full border-0"
                style={{ overflow: "hidden" }}
              />
            </div>

            {/* App Details */}
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <h3 className="truncate text-xs font-semibold text-label">
                {app.name}
              </h3>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold tracking-wide ${
                  app.status === "PUBLISHED"
                    ? "bg-crimson/15 text-coral"
                    : "bg-glass text-muted"
                }`}
              >
                {app.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
