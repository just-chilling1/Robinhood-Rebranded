import Link from "next/link"
import { PageHeader } from "@/components/page-header"

export default function BonusTrainingPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Bonus"
          title={
            <>
              Bonus training:{" "}
              <span className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-transparent bg-clip-text font-black">
                grow with Robinhood
              </span>
            </>
          }
          subtitle="Watch this exclusive session to get more from the platform"
        />

        {/* CTA Button */}
        <div className="w-full">
          <Link
            href="https://www.jvzoo.com/c/86517/415009"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#10b981] text-white text-2xl md:text-3xl font-black py-8 px-8 rounded-2xl text-center transition-all duration-300 shadow-2xl shadow-[#10b981]/30 hover:shadow-[#06b6d4]/50 hover:scale-105"
          >
            Click Here To Access Training &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
