"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react"

interface Offer {
  id: string
  title: string
  description: string
  commission_rate: string
  affiliate_network: string
}

interface OfferSelectorProps {
  nicheId: string
  onSelect: (offerId: string) => void
  onBack: () => void
}

export function OfferSelector({ nicheId, onSelect, onBack }: OfferSelectorProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from("offers").select("*").eq("niche_id", nicheId)

      if (data) {
        setOffers(data)
      }
      setLoading(false)
    }

    fetchOffers()
  }, [nicheId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="h-12 glass bg-transparent">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Select an Offer</h2>
        <p className="text-lg text-muted-foreground">Choose the product you want to promote</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="glass glow-blue border-border cursor-pointer hover:scale-[1.02] transition-all duration-300"
            onClick={() => onSelect(offer.id)}
          >
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-10 h-10 text-[#1E40AF]" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">{offer.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{offer.description}</p>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Commission:</span>
                      <span className="text-lg font-bold text-[#1E40AF]">{offer.commission_rate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Network:</span>
                      <span className="text-base font-semibold text-foreground">{offer.affiliate_network}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
