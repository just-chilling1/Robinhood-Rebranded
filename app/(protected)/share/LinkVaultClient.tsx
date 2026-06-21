"use client"

import { useEffect, useState } from "react"
import { Plus, ExternalLink, Edit2, Trash2, Copy, Flame, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InfoHint } from "@/components/ui/info-hint"
import { createClient } from "@/lib/supabase/client"

interface AffiliateLink {
  id: string
  niche: string
  offer_name: string
  affiliate_link: string
  notes?: string
  created_at: string
}

export default function LinkVaultClient() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form state
  const [niche, setNiche] = useState("")
  const [offerName, setOfferName] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setIsLoading(false)
      return
    }

    // For now, using pages table to store affiliate links
    // In production, create a separate affiliate_links table
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setLinks(data || [])
    setIsLoading(false)
  }

  const handleAddLink = async () => {
    if (!offerName || !affiliateLink) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    await supabase.from("pages").insert({
      user_id: user.id,
      title: offerName,
      affiliate_link: affiliateLink,
      content: notes || "",
      status: "active",
    })

    // Reset form
    setOfferName("")
    setAffiliateLink("")
    setNotes("")
    setIsAdding(false)
    
    // Refresh list
    fetchLinks()
  }

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl text-[#7dd3fc] font-bold">Loading your links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#fbbf24]/20 to-[#f97316]/20 border-2 border-[#fbbf24]/40">
          <DollarSign className="w-5 h-5 text-[#fbbf24]" />
          <span className="text-sm font-black text-white uppercase tracking-wider">Money Link Storage</span>
          <InfoHint
            label="A 'Money Link' is your affiliate link — the personal web link you share. When someone buys through it, you earn a commission."
            side="bottom"
          />
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight">Link Vault</h1>
        <p className="text-2xl text-[#7dd3fc] font-bold">
          Store your DigiStore, ClickBank, and affiliate links here. Use them in your comment campaigns 💰
        </p>
      </div>

      {/* Add New Link Button */}
      <Button
        onClick={() => setIsAdding(!isAdding)}
        className="h-16 px-8 text-lg font-black bg-gradient-to-r from-[#fbbf24] to-[#f97316] hover:from-[#f97316] hover:to-[#fbbf24] text-white rounded-2xl shadow-lg"
      >
        <Plus className="w-6 h-6 mr-2" />
        Add New Affiliate Link
      </Button>

      {/* Add Link Form */}
      {isAdding && (
        <Card className="glass-strong border-2 border-[#fbbf24]/40 animate-in slide-in-from-top duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white">Add Your Money Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-bold">Niche/Category</Label>
                <Input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., Weight Loss, Make Money, Dating"
                  className="h-12 glass border-2 border-[#0ea5e9]/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-bold">Offer Name</Label>
                <Input
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="e.g., Ultimate Weight Loss System"
                  className="h-12 glass border-2 border-[#0ea5e9]/30 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-bold">Your Affiliate Link</Label>
              <Input
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://hop.clickbank.net/... or https://digistore24.com/..."
                className="h-12 glass border-2 border-[#0ea5e9]/30 text-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-bold">Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Commission rate, target audience, best performing platform, etc."
                className="glass border-2 border-[#0ea5e9]/30 text-white"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddLink}
                className="h-14 px-8 font-black bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white rounded-xl"
              >
                Save Link
              </Button>
              <Button
                onClick={() => setIsAdding(false)}
                variant="outline"
                className="h-14 px-8 font-bold border-2 border-[#0ea5e9]/30 text-white rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      {links.length === 0 ? (
        <Card className="glass-strong border-2 border-[#0ea5e9]/40">
          <CardContent className="p-16 text-center space-y-8">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#fbbf24]/20 to-[#f97316]/20 flex items-center justify-center mx-auto border-2 border-[#fbbf24]/40">
              <DollarSign className="w-16 h-16 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-4">No Affiliate Links Yet</h2>
              <p className="text-xl text-[#7dd3fc] font-semibold">
                Add your DigiStore or ClickBank links to start making money with your comment campaigns
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <Card key={link.id} className="glass-strong border-2 border-[#0ea5e9]/30 hover:border-[#fbbf24]/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">{link.title}</h3>
                      <p className="text-sm text-[#7dd3fc] font-semibold">
                        Added {new Date(link.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4 border-2 border-[#0ea5e9]/20 flex items-center gap-3">
                      <Input
                        value={link.affiliate_link}
                        readOnly
                        className="flex-1 bg-transparent border-0 text-white font-mono text-sm"
                      />
                      <Button
                        onClick={() => copyLink(link.affiliate_link, link.id)}
                        className={`h-10 px-4 font-black rounded-lg ${
                          copiedId === link.id
                            ? "bg-[#10b981] text-white"
                            : "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white"
                        }`}
                      >
                        {copiedId === link.id ? "✓ Copied!" : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(link.affiliate_link, "_blank")}
                      className="h-12 w-12 glass-strong border-2 border-[#0ea5e9]/30 hover:border-[#0ea5e9] rounded-xl"
                    >
                      <ExternalLink className="w-5 h-5 text-[#0ea5e9]" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pro Tips */}
      <Card className="glass-strong border-2 border-[#ec4899]/40">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-[#ec4899]" />
            Link Vault Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <div className="space-y-2">
              <h4 className="font-black text-[#fbbf24]">💎 Organize by Niche</h4>
              <p className="text-[#7dd3fc]">
                Match your links to specific niches for better targeting
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#10b981]">💎 Test Multiple Offers</h4>
              <p className="text-[#7dd3fc]">
                Try different products in the same niche to find winners
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#0ea5e9]">💎 Track Your Links</h4>
              <p className="text-[#7dd3fc]">
                Use link shorteners with analytics (Bitly, TinyURL)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-[#ec4899]">💎 High Ticket = High Cash</h4>
              <p className="text-[#7dd3fc]">
                Focus on offers $100+ for serious commissions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

