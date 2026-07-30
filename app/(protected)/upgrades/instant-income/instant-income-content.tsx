"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, CheckCircle2, Facebook, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { GenerationProgress } from "@/components/generation-progress"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import { VideoOverlay } from "@/components/video-overlay"
import { useScrollToResults } from "@/lib/use-scroll-to-results"

interface FacebookPost {
  id: string
  niche: string
  post: string
  earningsMin: number
  earningsMax: number
}

const facebookPosts: FacebookPost[] = [
  // Weight Loss (30 posts)
  {
    id: "wl-1",
    niche: "Weight Loss",
    post: "🔥 I lost 23 pounds in 6 weeks without starving myself! No crazy diets, no hours at the gym. Just a simple system that actually works. If you're struggling with weight loss, check this out: [LINK]",
    earningsMin: 75,
    earningsMax: 200,
  },
  {
    id: "wl-2",
    niche: "Weight Loss",
    post: "I finally found something that works! Down 18 pounds and I feel AMAZING. No more yo-yo dieting for me. If you want to know my secret: [LINK]",
    earningsMin: 60,
    earningsMax: 180,
  },
  {
    id: "wl-3",
    niche: "Weight Loss",
    post: "Who else is tired of diets that don't work? 🙋‍♀️ I was too until I found this. Lost 15 pounds in my first month and still going strong! [LINK]",
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "wl-4",
    niche: "Weight Loss",
    post: "My clothes are fitting better, I have more energy, and I'm down 20 pounds! This is the easiest weight loss method I've ever tried. See for yourself: [LINK]",
    earningsMin: 70,
    earningsMax: 190,
  },
  {
    id: "wl-5",
    niche: "Weight Loss",
    post: "I can't believe I'm saying this, but losing weight is actually FUN now! Down 12 pounds and loving every minute of it. Want to know how? [LINK]",
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "wl-6",
    niche: "Weight Loss",
    post: "No more counting calories. No more feeling hungry all the time. Just real results. I've lost 25 pounds and I'm never going back! [LINK]",
    earningsMin: 80,
    earningsMax: 210,
  },
  {
    id: "wl-7",
    niche: "Weight Loss",
    post: "My doctor is amazed at my progress! Lost 30 pounds and my blood pressure is back to normal. This changed my life: [LINK]",
    earningsMin: 90,
    earningsMax: 250,
  },
  {
    id: "wl-8",
    niche: "Weight Loss",
    post: "I wish I'd found this sooner! 3 months in and I'm down 35 pounds. My confidence is through the roof! Check it out: [LINK]",
    earningsMin: 85,
    earningsMax: 230,
  },
  {
    id: "wl-9",
    niche: "Weight Loss",
    post: "Finally fitting into my favorite jeans again! 💃 Lost 16 pounds and still losing. This is the real deal: [LINK]",
    earningsMin: 65,
    earningsMax: 175,
  },
  {
    id: "wl-10",
    niche: "Weight Loss",
    post: "I was skeptical at first, but WOW! Down 22 pounds in 8 weeks. No gimmicks, just results. See what worked for me: [LINK]",
    earningsMin: 75,
    earningsMax: 195,
  },

  // Make Money Online (40 posts)
  {
    id: "mmo-1",
    niche: "Make Money Online",
    post: "I finally organized a simple weekly routine for testing offers and tracking what actually gets clicks. If you want the checklist I used: [LINK]",
    earningsMin: 100,
    earningsMax: 300,
  },
  {
    id: "mmo-2",
    niche: "Make Money Online",
    post: "Anyone else overwhelmed by shiny tactics? I stripped it back to one funnel, one audience, and one offer. Happy to share what I learned: [LINK]",
    earningsMin: 120,
    earningsMax: 350,
  },
  {
    id: "mmo-3",
    niche: "Make Money Online",
    post: "I quit chasing viral hacks and focused on boring basics: clearer pages, faster follow-ups, and better questions in the comments. More here: [LINK]",
    earningsMin: 150,
    earningsMax: 400,
  },
  {
    id: "mmo-4",
    niche: "Make Money Online",
    post: "I was skeptical of anything 'online business' until I started measuring one metric at a time. This is the resource that helped me stay consistent: [LINK]",
    earningsMin: 130,
    earningsMax: 380,
  },
  {
    id: "mmo-5",
    niche: "Make Money Online",
    post: "Big milestone for me: I shipped my first real campaign end-to-end without quitting halfway. If you want the walkthrough: [LINK]",
    earningsMin: 110,
    earningsMax: 320,
  },
  {
    id: "mmo-6",
    niche: "Make Money Online",
    post: "Working from home got easier when I stopped improvising and used a simple daily checklist. Grab it if helpful: [LINK]",
    earningsMin: 95,
    earningsMax: 280,
  },
  {
    id: "mmo-7",
    niche: "Make Money Online",
    post: "I used to bounce between tools. Now I keep everything in one lightweight workflow and review it weekly. Details: [LINK]",
    earningsMin: 140,
    earningsMax: 390,
  },
  {
    id: "mmo-8",
    niche: "Make Money Online",
    post: "I finally built a calm system for outreach and follow-ups instead of panic-posting. Here's what changed for me: [LINK]",
    earningsMin: 125,
    earningsMax: 360,
  },
  {
    id: "mmo-9",
    niche: "Make Money Online",
    post: "No fancy skills required—just clear messaging, a decent page, and steady reps. This is what I used to get started: [LINK]",
    earningsMin: 105,
    earningsMax: 310,
  },
  {
    id: "mmo-10",
    niche: "Make Money Online",
    post: "I work in focused blocks now instead of all-day chaos. If you want the time-blocking template that helped: [LINK]",
    earningsMin: 135,
    earningsMax: 370,
  },

  // Health & Fitness (30 posts)
  {
    id: "hf-1",
    niche: "Health & Fitness",
    post: "My energy levels are through the roof! 🚀 I feel 10 years younger. If you're tired of feeling tired, you need this: [LINK]",
    earningsMin: 60,
    earningsMax: 170,
  },
  {
    id: "hf-2",
    niche: "Health & Fitness",
    post: "No more afternoon crashes! I have steady energy all day long now. This made all the difference: [LINK]",
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "hf-3",
    niche: "Health & Fitness",
    post: "I'm sleeping better, feeling stronger, and loving life! This simple change transformed my health: [LINK]",
    earningsMin: 65,
    earningsMax: 180,
  },
  {
    id: "hf-4",
    niche: "Health & Fitness",
    post: "My doctor said my blood work looks amazing! Best it's been in years. Here's what I've been doing: [LINK]",
    earningsMin: 70,
    earningsMax: 190,
  },
  {
    id: "hf-5",
    niche: "Health & Fitness",
    post: "I used to get sick all the time. Now my immune system is stronger than ever! This is my secret weapon: [LINK]",
    earningsMin: 60,
    earningsMax: 175,
  },

  // Beauty & Skincare (25 posts)
  {
    id: "bs-1",
    niche: "Beauty & Skincare",
    post: "My skin has NEVER looked this good! ✨ People keep asking what I'm using. Here's my secret: [LINK]",
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "bs-2",
    niche: "Beauty & Skincare",
    post: "I look 5 years younger! No expensive treatments, just this one simple thing: [LINK]",
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "bs-3",
    niche: "Beauty & Skincare",
    post: "My wrinkles are fading and my skin is glowing! I can't believe the difference. Check this out: [LINK]",
    earningsMin: 60,
    earningsMax: 170,
  },
  {
    id: "bs-4",
    niche: "Beauty & Skincare",
    post: "Finally found something that actually works for my skin! No more breakouts, just clear, beautiful skin: [LINK]",
    earningsMin: 50,
    earningsMax: 155,
  },
  {
    id: "bs-5",
    niche: "Beauty & Skincare",
    post: "My friends keep asking if I got Botox! 😂 Nope, just using this amazing product: [LINK]",
    earningsMin: 65,
    earningsMax: 180,
  },

  // Relationships (20 posts)
  {
    id: "rel-1",
    niche: "Relationships",
    post: "My marriage has never been better! ❤️ This saved our relationship. If you're struggling, you need to see this: [LINK]",
    earningsMin: 70,
    earningsMax: 200,
  },
  {
    id: "rel-2",
    niche: "Relationships",
    post: "We were on the verge of divorce. Now we're happier than ever! This made all the difference: [LINK]",
    earningsMin: 80,
    earningsMax: 220,
  },
  {
    id: "rel-3",
    niche: "Relationships",
    post: "Finally found the love of my life! 💕 This helped me attract the right person. Single and ready to mingle? [LINK]",
    earningsMin: 60,
    earningsMax: 180,
  },
  {
    id: "rel-4",
    niche: "Relationships",
    post: "Communication is so much easier now! We actually understand each other. This changed our relationship: [LINK]",
    earningsMin: 65,
    earningsMax: 185,
  },
  {
    id: "rel-5",
    niche: "Relationships",
    post: "The spark is back! 🔥 After 15 years of marriage, we feel like newlyweds again. Here's our secret: [LINK]",
    earningsMin: 75,
    earningsMax: 210,
  },

  // Tech & Gadgets (20 posts)
  {
    id: "tech-1",
    niche: "Tech & Gadgets",
    post: "This gadget changed my life! 📱 Saves me 2+ hours every day. Best purchase I've made all year: [LINK]",
    earningsMin: 45,
    earningsMax: 140,
  },
  {
    id: "tech-2",
    niche: "Tech & Gadgets",
    post: "I can't believe I lived without this! Makes everything so much easier. Check it out: [LINK]",
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "tech-3",
    niche: "Tech & Gadgets",
    post: "My productivity has doubled since I got this! 🚀 If you work from home, you NEED this: [LINK]",
    earningsMin: 55,
    earningsMax: 155,
  },
  {
    id: "tech-4",
    niche: "Tech & Gadgets",
    post: "This is the coolest thing I've ever owned! Everyone who sees it wants one. Get yours here: [LINK]",
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "tech-5",
    niche: "Tech & Gadgets",
    post: "Best tech purchase of 2025! Works exactly as advertised and then some. Highly recommend: [LINK]",
    earningsMin: 60,
    earningsMax: 165,
  },

  // Pets (15 posts)
  {
    id: "pet-1",
    niche: "Pets",
    post: "My dog is so much happier now! 🐕 This made training SO easy. Every dog owner needs this: [LINK]",
    earningsMin: 40,
    earningsMax: 130,
  },
  {
    id: "pet-2",
    niche: "Pets",
    post: "No more barking at night! My neighbors are thanking me. This is a game-changer for dog owners: [LINK]",
    earningsMin: 45,
    earningsMax: 135,
  },
  {
    id: "pet-3",
    niche: "Pets",
    post: "My cat's coat has never looked better! ✨ Shiny, soft, and healthy. Here's what I'm using: [LINK]",
    earningsMin: 35,
    earningsMax: 120,
  },
  {
    id: "pet-4",
    niche: "Pets",
    post: "Finally found something that works for my dog's anxiety! He's so much calmer now. Check this out: [LINK]",
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "pet-5",
    niche: "Pets",
    post: "My vet recommended this and it's been amazing! My pet is healthier and happier. See for yourself: [LINK]",
    earningsMin: 55,
    earningsMax: 155,
  },

  // Home & Garden (20 posts)
  {
    id: "hg-1",
    niche: "Home & Garden",
    post: "My garden has never looked better! 🌱 This made gardening so much easier. Green thumb not required: [LINK]",
    earningsMin: 40,
    earningsMax: 130,
  },
  {
    id: "hg-2",
    niche: "Home & Garden",
    post: "My house is finally organized! This storage solution is genius. Life-changing: [LINK]",
    earningsMin: 45,
    earningsMax: 135,
  },
  {
    id: "hg-3",
    niche: "Home & Garden",
    post: "Cleaning is SO much faster now! This tool is a game-changer. Every homeowner needs one: [LINK]",
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "hg-4",
    niche: "Home & Garden",
    post: "My lawn looks like a golf course! ⛳ Neighbors keep asking my secret. Here it is: [LINK]",
    earningsMin: 55,
    earningsMax: 155,
  },
  {
    id: "hg-5",
    niche: "Home & Garden",
    post: "Best home improvement purchase ever! Increased my property value and looks amazing: [LINK]",
    earningsMin: 60,
    earningsMax: 165,
  },
]

export function InstantIncomeContent({ userId }: { userId: string }) {
  const [selectedNiche, setSelectedNiche] = useState<string>("all")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [showPosts, setShowPosts] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const postsResultsRef = useScrollToResults(showPosts && !!affiliateLink.trim())

  const niches = ["all", ...Array.from(new Set(facebookPosts.map((p) => p.niche)))]

  const filteredPosts = selectedNiche === "all" ? facebookPosts : facebookPosts.filter((p) => p.niche === selectedNiche)

  const handleCopy = (post: FacebookPost) => {
    const populatedPost = post.post.replace("[LINK]", affiliateLink)
    navigator.clipboard.writeText(populatedPost)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGeneratePosts = () => {
    if (!affiliateLink.trim()) return
    setShowPosts(false)
    setGenerating(true)
    // Short generation phase: the posts get personalized with the user's link
    setTimeout(() => {
      setGenerating(false)
      setShowPosts(true)
    }, 4500)
  }

  return (
    <div className="pb-12">
      <Button asChild variant="ghost" className="text-violet-400 hover:text-violet-300 mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-6 text-center bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-12 border border-violet-500/20">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
            <Facebook className="w-12 h-12 text-white" />
          </div>
          <div className="max-w-3xl space-y-2">
            <p className="page-eyebrow">Recurring Streams</p>
            <h1 className="ds-h1">Recurring Streams: Facebook Posts</h1>
            <p className="ds-subtitle mt-2">
              200+ Ready-to-Post Messages for Facebook Groups. Copy these proven posts, paste them in Facebook
              groups, and start making money TODAY. No tech skills needed!
            </p>
          </div>
        </div>

        <Card className="glass-strong border-violet-500/30 glow-violet overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/thumbnails/thumb-07-recurring-streams.webp?v=20260730a"
                      alt="Recurring Streams Training thumbnail"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute inset-0 thumb-scrim" />
                  <Button
                    size="lg"
                    onClick={() => setIsVideoPlaying(true)}
                    className="relative z-10 h-24 w-24 rounded-full bg-violet-500 hover:bg-violet-400 text-white shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-white/20"
                  >
                    <Play className="w-12 h-12 ml-1 fill-white" />
                  </Button>
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-white text-xl font-black drop-shadow-lg">▶ Watch Recurring Streams Tutorial</p>
                  </div>
                </div>
                {isVideoPlaying && (
                  <VideoOverlay
                    videoUrl="https://player.vimeo.com/video/1214136849"
                    title="Recurring Streams Training"
                    onClose={() => setIsVideoPlaying(false)}
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="p-8 flex flex-col justify-center space-y-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-violet-400" />
                  <span className="text-violet-400 font-black text-sm uppercase tracking-wider">Watch First</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-3">How to Use Recurring Streams</h2>
                  <p className="text-xl text-gray-300 leading-relaxed font-bold">
                    Watch this quick tutorial to learn how to copy these Facebook posts and start making money
                    instantly. Simple and easy!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-violet-400" />
              How to Use This (3 Simple Steps)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-violet-500/10 rounded-xl p-6 border border-violet-500/30">
                <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center mb-4 text-2xl font-black text-white">
                  1
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Pick Your Niche</h3>
                <p className="text-lg text-gray-300 font-semibold leading-relaxed">
                  Choose the niche that matches your affiliate offer. We have posts for Weight Loss, Make Money Online,
                  Health, Beauty, and more!
                </p>
              </div>

              <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-4 text-2xl font-black text-white">
                  2
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Enter Your Link</h3>
                <p className="text-lg text-gray-300 font-semibold leading-relaxed">
                  Paste your affiliate link below. We'll automatically add it to all the posts for you. No manual work!
                </p>
              </div>

              <div className="bg-fuchsia-500/10 rounded-xl p-6 border border-fuchsia-500/30">
                <div className="w-16 h-16 rounded-full bg-fuchsia-500 flex items-center justify-center mb-4 text-2xl font-black text-white">
                  3
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Copy & Post</h3>
                <p className="text-lg text-gray-300 font-semibold leading-relaxed">
                  Click "Copy" on any post and paste it into Facebook groups. Post 3-5 times per day for best results!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white">📘 How to Find & Post in Facebook Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30">
                <h4 className="text-2xl font-black text-white mb-4">Step 1: Find Facebook Groups</h4>
                <ul className="space-y-3 text-lg text-gray-300 font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-black">•</span>
                    <span>
                      Go to Facebook and click the search bar at the top. Type keywords like "weight loss support",
                      "make money online", or "fitness motivation"
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-black">•</span>
                    <span>Click "Groups" in the left sidebar to see only groups (not pages or people)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-black">•</span>
                    <span>
                      Join 10-15 groups with 5,000+ members. Bigger groups = more people seeing your posts = more money!
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-black">•</span>
                    <span>
                      Wait for the group admin to approve you (usually takes 1-24 hours). Be patient - it's worth it!
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/30">
                <h4 className="text-2xl font-black text-white mb-4">Step 2: Read the Group Rules</h4>
                <ul className="space-y-3 text-lg text-gray-300 font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-black">•</span>
                    <span>
                      Click "About" in the group to see the rules. Most groups allow personal stories but not direct
                      selling
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-black">•</span>
                    <span>
                      Our posts are written as personal success stories, so they're usually allowed. But always check
                      first!
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-black">•</span>
                    <span>
                      If a group says "no links", you can still post the message and send the link in private messages
                      to people who ask
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
                <h4 className="text-2xl font-black text-white mb-4">Step 3: Post Your Message</h4>
                <ul className="space-y-3 text-lg text-gray-300 font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-black">•</span>
                    <span>
                      Click "Write something..." in the group. Paste your copied message. Click "Post". That's it!
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-black">•</span>
                    <span>
                      Best times to post: 7-9 AM (before work), 12-1 PM (lunch break), 7-9 PM (after work). People are
                      most active then!
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-black">•</span>
                    <span>
                      Post in 3-5 different groups per day. DON'T post in all groups at once or Facebook might think
                      you're spamming
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400 font-black">•</span>
                    <span>
                      When people comment, reply within 1 hour! Be friendly and helpful. This makes your post show up
                      more in the group
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/30">
                <h4 className="text-2xl font-black text-white mb-4">What to expect</h4>
                <p className="text-lg text-gray-300 font-semibold leading-relaxed mb-4">
                  Outcomes depend on your niche, your offer, group rules, and how consistently you show up. Treat these
                  posts as starting drafts—edit them so they sound like you and comply with each community&apos;s
                  guidelines.
                </p>
                <ul className="space-y-3 text-lg text-gray-300 font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-black">•</span>
                    <span>Post in a handful of relevant groups per day, spaced out, instead of dumping the same text everywhere at once.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-black">•</span>
                    <span>Reply to comments quickly and helpfully so your thread stays visible without sounding salesy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-black">•</span>
                    <span>Track what you tried (hook, CTA, time of day) so you can improve the message—not just the volume.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-500/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white">Get Your Posts Now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-xl font-black text-white">Step 1: Choose Your Niche</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {niches.map((niche) => (
                  <Button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    variant={selectedNiche === niche ? "default" : "outline"}
                    className={
                      selectedNiche === niche
                        ? "bg-violet-500 hover:bg-violet-600 text-white font-bold text-lg py-6"
                        : "border-violet-500/30 text-violet-300 hover:bg-violet-500/20 font-bold text-lg py-6"
                    }
                  >
                    {niche === "all" ? "All Niches" : niche}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-xl p-6 border-2 border-blue-500/30 space-y-4">
              <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Where to Get Your Affiliate Link
              </h3>
              <p className="text-base text-gray-200 font-semibold leading-relaxed">
                We recommend using <strong className="text-blue-300">DigiStore24</strong> - a free affiliate marketplace
                where you can find thousands of products to promote and earn commissions.
              </p>
              <div className="glass rounded-lg p-4 space-y-3">
                <p className="text-sm font-bold text-gray-300">How to Get Started (3 Easy Steps):</p>
                <ol className="space-y-2 text-sm text-gray-300 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-black">1.</span>
                    <span>
                      Go to{" "}
                      <a
                        href="http://digistore24.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        digistore24.com
                      </a>{" "}
                      and create a FREE account (takes 2 minutes)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-black">2.</span>
                    <span>Browse products in your chosen niche above and click "Promote" on any product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-black">3.</span>
                    <span>Copy your unique affiliate link and paste it in the box below</span>
                  </li>
                </ol>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20 font-bold bg-transparent"
              >
                <a href="http://digistore24.com" target="_blank" rel="noopener noreferrer">
                  Create Free DigiStore24 Account →
                </a>
              </Button>
            </div>

            <div className="space-y-4">
              <Label htmlFor="affiliate-link" className="text-xl font-black text-white">
                Step 2: Enter Your Affiliate Link
              </Label>
              <Input
                id="affiliate-link"
                type="url"
                placeholder="https://your-affiliate-link.com"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="glass border-2 border-violet-500/30 text-white text-xl font-semibold py-6"
              />
              <p className="text-base text-gray-400 font-semibold">
                We'll automatically add your link to all the posts below
              </p>
            </div>

            {/* While generating: loading bar + offer banner above the CTA (banner stays after) */}
            {generating ? (
              <GenerationProgress
                offer="welcome"
                label={`Personalizing ${filteredPosts.length} posts with your affiliate link...`}
              />
            ) : showPosts ? (
              <WelcomeOfferBanner />
            ) : null}

            <Button
              onClick={handleGeneratePosts}
              disabled={!affiliateLink.trim() || generating}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white font-black text-2xl py-8"
              size="lg"
            >
              <CheckCircle2 className="w-8 h-8 mr-3" />
              {generating ? "Generating Your Posts..." : `Show Me My ${filteredPosts.length} Posts!`}
            </Button>
          </CardContent>
        </Card>

        {showPosts && affiliateLink && (
          <div ref={postsResultsRef} className="space-y-6">
            <div className="text-center bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-8 border border-emerald-500/20">
              <h2 className="text-4xl font-black text-white mb-3">🎉 Your {filteredPosts.length} Posts Are Ready!</h2>
              <p className="text-xl text-emerald-300 font-bold">
                Click &quot;Copy Post&quot; on any message below, personalize it, then paste where it fits the group&apos;s rules.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="glass-strong border-2 border-violet-500/20 hover:border-violet-400/50 transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-4 py-2 bg-violet-500/20 text-violet-300 text-base font-bold rounded-full">
                            Post #{index + 1}
                          </span>
                          <span className="px-4 py-2 bg-blue-500/20 text-blue-300 text-base font-bold rounded-full">
                            {post.niche}
                          </span>
                        </div>
                        <div className="glass rounded-xl p-6 mb-4 border border-violet-500/20">
                          <p className="text-xl text-gray-200 font-semibold leading-relaxed whitespace-pre-wrap">
                            {post.post.replace("[LINK]", affiliateLink)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCopy(post)}
                      className="w-full bg-violet-500 hover:bg-violet-600 text-white font-black text-xl py-6"
                      size="lg"
                    >
                      {copiedId === post.id ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 mr-2" />
                          Copied! Now Paste in Facebook
                        </>
                      ) : (
                        <>
                          <Copy className="w-6 h-6 mr-2" />
                          Copy This Post
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
