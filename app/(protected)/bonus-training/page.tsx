import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { PRODUCT_NAME } from "@/lib/brand"

export default function BonusTrainingPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Bonus"
          title={
            <>
              Bonus training:{" "}
              <span className="text-sapphire-700 font-black">
                grow with {PRODUCT_NAME}
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
            className="block w-full bg-gradient-to-r from-primary to-primary hover:from-primary-hover hover:to-primary-hover text-white text-2xl md:text-3xl font-black py-8 px-8 rounded-2xl text-center transition-all duration-300 shadow-2xl shadow-primary/30 hover:shadow-[var(--ds-sapphire-500)]/50 hover:scale-105"
          >
            Click Here To Access Training &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
