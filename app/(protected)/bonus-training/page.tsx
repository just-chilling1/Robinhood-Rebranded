import Link from "next/link"

export default function BonusTrainingPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Headline Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Bonus training:{" "}
            <span className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-transparent bg-clip-text font-black">
              grow with Robinhood
            </span>
          </h1>
          <p className="text-xl text-[#7dd3fc] font-bold mb-8">
            Watch this exclusive session to get more from the platform
          </p>
        </div>

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
