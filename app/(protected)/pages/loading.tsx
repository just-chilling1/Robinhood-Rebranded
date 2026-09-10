export default function PagesLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted/70" />
          <div className="h-5 w-80 max-w-full animate-pulse rounded bg-muted/50" />
        </div>
        <div className="h-12 w-48 animate-pulse rounded-full bg-muted/70" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-2xl bg-muted/40" />
        <div className="h-44 animate-pulse rounded-2xl bg-muted/40" />
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted/50" />
        ))}
      </div>
    </div>
  )
}
