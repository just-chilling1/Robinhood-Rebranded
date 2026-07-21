import Link from "next/link"
import { ArrowRight, Link2, MessageSquare, Rocket } from "lucide-react"

const steps = [
  {
    number: 1,
    time: "about 2 minutes",
    icon: Link2,
    title: "Add your money link",
    description:
      "Save your affiliate link (DigiStore, ClickBank...). When someone buys through it, the commission goes to you.",
    cta: "Add my link",
    href: "/share",
  },
  {
    number: 2,
    time: "about 3 minutes",
    icon: MessageSquare,
    title: "Generate your comments",
    description:
      "Fire up Gold Rush. The AI finds viral YouTube Shorts and writes ready-to-post comments with your link inside.",
    cta: "Fire up Gold Rush",
    href: "/create",
  },
  {
    number: 3,
    time: "about 1 minute",
    icon: Rocket,
    title: "Post and get paid",
    description:
      "Copy a comment, paste it on the video, done. Every pack is saved in your vault so you can reuse it anytime.",
    cta: "Open my vault",
    href: "/pages",
  },
]

export function HowItWorks() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Here&apos;s how it works</h2>
        <p className="text-lg text-[#7dd3fc]">You only need to do 3 things. Each one takes just a few minutes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="glass-strong rounded-2xl border border-[#0ea5e9]/25 p-5 flex flex-col hover:border-[#0ea5e9]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 text-lg font-black text-[#7dd3fc]">
                {step.number}
              </div>
              <span className="text-sm font-bold text-[#fbbf24]">{step.time}</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <step.icon className="h-6 w-6 text-[#0ea5e9]" />
              <h3 className="text-xl font-black text-white">{step.title}</h3>
            </div>

            <p className="text-base leading-relaxed text-[#a5c9e8] flex-1 mb-6">{step.description}</p>

            <Link
              href={step.href}
              className="flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-base font-black text-white shadow-lg shadow-[#0ea5e9]/20 transition-all hover:from-[#06b6d4] hover:to-[#0ea5e9] hover:shadow-[#0ea5e9]/40"
            >
              {step.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
