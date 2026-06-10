import Link from "next/link"
import { Smartphone, DollarSign, TrendingUp } from "lucide-react"

export function EarningsBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 md:p-5 mb-4">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="flex-shrink-0">
          <div className="relative w-24 md:w-32 h-24 md:h-32 flex items-center justify-center">
            {/* Phone icon with dollar signs */}
            <div className="relative">
              <Smartphone className="w-16 h-16 md:w-20 md:h-20 text-white/90" strokeWidth={1.5} />
              <DollarSign
                className="absolute -top-1 -right-1 w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-pulse"
                strokeWidth={2.5}
              />
              <TrendingUp
                className="absolute -bottom-1 -left-1 w-7 h-7 md:w-8 md:h-8 text-emerald-200"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
            Wanna Wake Up With An Additional $1,000-$5,000 In Your Bank Account Tomorrow?
          </h2>
          <p className="text-sm text-white/95 mb-3 leading-relaxed">
            Robinhood is amazing, but if you want to know how to scale to $1,000 - $5,000 every single day... without doing any extra work...
            <br />
            <br />
            Then you have to watch this FREE training now (Will be taken down soon)
          </p>
          <Link
            href="https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-semibold text-sm px-4 py-2 rounded-md transition-colors duration-200"
          >
            Click Here To Watch Free Training &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  )
}
