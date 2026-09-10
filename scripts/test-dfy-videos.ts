import { fetchVideoOpportunities } from "../app/actions/fetch-video-opportunities"

async function main() {
  const cases = [
    {
      productName: "Google",
      productDescription: "Search the world",
      keyword: "Make Money Online",
      mode: "niche" as const,
    },
    {
      productName: "Make Money Online",
      productDescription: "Make Money Online affiliate offer",
      keyword: "Make Money Online",
      mode: "niche" as const,
    },
  ]

  for (const input of cases) {
    const results = await fetchVideoOpportunities(input)
    console.log({
      productName: input.productName,
      count: results.length,
      titles: results.slice(0, 3).map((v) => v.title),
    })
  }
}

main().catch(console.error)
