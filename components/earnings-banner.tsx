import Link from "next/link"
import { Smartphone, DollarSign, TrendingUp } from "lucide-react"

export function EarningsBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <div className="relative w-40 md:w-52 h-40 md:h-52 flex items-center justify-center">
            {/* Phone icon with dollar signs */}
            <div className="relative">
              <Smartphone className="w-24 h-24 md:w-32 md:h-32 text-white/90" strokeWidth={1.5} />
              <DollarSign
                className="absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 text-amber-400 animate-pulse"
                strokeWidth={2.5}
              />
              <TrendingUp
                className="absolute -bottom-2 -left-2 w-10 h-10 md:w-12 md:h-12 text-emerald-200"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            Wanna Wake Up With An Additional $1,000-$5,000 In Your Bank Account Tomorrow?
          </h2>
          <p className="text-sm md:text-base text-white/95 mb-4 leading-relaxed">
            Robinhood is amazing, but if you want to know how to scale to $1,000 - $5,000 every single day... without doing any extra work...
            <br />
            <br />
            Then you have to watch this FREE training now (Will be taken down soon)
          </p>
          <Link
            href="https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-md transition-colors duration-200"
          >
            Click Here To Watch Free Training &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
