import { config } from "dotenv"
config({ path: ".env.local" })

const { fetchVideoOpportunities } = await import("../app/actions/fetch-video-opportunities.ts")

const cases = [
  { productName: "Google", productDescription: "Search the world", keyword: "Make Money Online", mode: "niche" },
  { productName: "Make Money Online", productDescription: "Make Money Online", keyword: "Make Money Online", mode: "niche" },
]

for (const input of cases) {
  const r = await fetchVideoOpportunities(input)
  console.log(JSON.stringify({ input: input.productName, count: r.length, titles: r.slice(0, 3).map((v) => v.title) }))
}
