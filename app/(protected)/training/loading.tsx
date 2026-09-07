export default function TrainingLoading() {
  return (
    <div className="page-container mx-auto w-full max-w-7xl">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted/70" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted/50" />
      </div>

      <div className="page-stack mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
        <div className="h-36 animate-pulse rounded-2xl bg-muted/50" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
      </div>
    </div>
  )
}
