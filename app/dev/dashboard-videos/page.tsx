import { DashboardVideoCard } from "@/components/dashboard-video-card"
import { DASHBOARD_TRAINING_VIDEOS } from "@/lib/dashboard-training-videos"

/** Local preview only — middleware blocks /dev/* outside development. */
export default function DashboardVideosPreviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="ds-h1">Dashboard video cards</h1>
      {DASHBOARD_TRAINING_VIDEOS.map((video) => (
        <DashboardVideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
