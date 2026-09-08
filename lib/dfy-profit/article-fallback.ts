import type { GeneratedArticleContent } from "./types"
import type { ArticlePromptInput } from "./prompts"

function paragraph(text: string): string {
  return `<p>${text}</p>`
}

/**
 * Template authority article. Deliberately generic but genuinely readable, so a
 * kit generated without AI is still usable.
 */
export function buildFallbackArticle(input: ArticlePromptInput): GeneratedArticleContent {
  const { productName, niche } = input
  const context = input.productContext || niche
  const title = `What Actually Works in ${niche}: An Honest Guide`

  const sections = [
    `<h2>The real problem with ${niche}</h2>`,
    paragraph(
      `Most people who look into ${niche} do not fail because they are lazy. They fail because the first advice they find is written to sell something rather than to explain anything. You end up with a pile of tips that contradict each other, no way to tell which one applies to you, and no sense of what order to do things in. That is the actual problem, and it is worth naming before we go further.`,
    ),
    paragraph(
      `The approach below is deliberately boring. It assumes you have limited time, limited budget, and no appetite for guessing. Every step is something you can start this week without buying anything, and the places where a paid tool genuinely saves time are called out honestly rather than hidden.`,
    ),
    `<h2>Start by narrowing what you are actually trying to change</h2>`,
    paragraph(
      `Vague goals produce vague effort. "Get better at ${niche}" cannot be measured, so it cannot be improved. Write down the single outcome you want and the date you want it by. Then write the smallest weekly action that moves you toward it. One specific action done for six weeks beats five actions abandoned in the second week, every single time.`,
    ),
    paragraph(
      `This step feels too simple to matter, which is exactly why most people skip it. Do not skip it. Everything that follows depends on knowing what you are aiming at, because otherwise you have no way to judge whether any given tactic is working or just keeping you busy.`,
    ),
    `<h2>Build the habit before you optimise the method</h2>`,
    paragraph(
      `There is a strong temptation to research the perfect method before starting. Resist it. The people who get results in ${niche} are almost never the ones with the best plan. They are the ones who kept going long enough for an average plan to compound. Consistency is not a motivational slogan here, it is the mechanism that makes everything else work.`,
    ),
    paragraph(
      `Pick a schedule you can keep on a bad week, not a good one. If it only works when you are motivated, it is not a schedule, it is a mood. Once the habit is stable for a month, then start refining the method. Optimising something you are not doing yet is procrastination wearing a lab coat.`,
    ),
    `<h2>Track a small number of honest numbers</h2>`,
    paragraph(
      `You need feedback, but not a dashboard. Two or three numbers, checked weekly, will tell you almost everything a complicated tracking system would. Write them in the same place every week and look at the direction of travel rather than any single reading. Week-to-week noise means nothing; a flat line across six weeks means your method needs to change.`,
    ),
    paragraph(
      `Be honest when you record them, especially when the number is disappointing. A tracker you edit to feel better about yourself is worse than no tracker at all, because it removes the only signal you had. Disappointing data is not failure, it is the information you needed in order to adjust.`,
    ),
    `<h2>Ignore advice that cannot be tested</h2>`,
    paragraph(
      `A surprising amount of content about ${niche} cannot be verified in the real world. If a tip has no measurable outcome, no time frame, and no way to know whether it worked, it is not a tip. It is entertainment. Treat it as such and keep your attention on the few actions you can actually check. When you are unsure, ask what you would measure next Friday if you followed the advice for a week.`,
    ),
    paragraph(
      `The same filter applies to people online who seem to have everything figured out. You do not know their starting point, their resources, or how long they have been at it. Compare yourself only to your own numbers from last month. That comparison is the only one that improves the next decision.`,
    ),
    `<h2>Where a paid resource genuinely helps</h2>`,
    paragraph(
      `Nothing above requires spending money, and you should not spend any until the habit is in place. What a good paid resource buys you is sequencing: someone who has already made the mistakes tells you what order to do things in, which saves months of trial and error. That is a real benefit, and it is the only benefit worth paying for.`,
    ),
    paragraph(
      `${productName} is built around ${context}. It is worth a look once you have done the groundwork above, because at that point you will be able to judge whether its approach fits your situation. Before then, no resource can help you, because the missing ingredient is not information. [LINK]`,
    ),
    `<h2>FAQ</h2>`,
    paragraph(`<strong>How long before I see results?</strong> Expect six to eight weeks of consistent effort before the numbers move in a way you can trust. Anything faster is usually noise, and anyone promising faster is selling rather than explaining. Individual results vary.`),
    paragraph(`<strong>Do I need to buy anything to start?</strong> No. Every step in this guide can be done for free. Paid resources save time and reduce guesswork once you are already moving, but they cannot replace the habit itself.`),
    paragraph(`<strong>What if I miss a week?</strong> Restart the same week without adding penalty work. Missing a week is normal and costs you very little. Abandoning the whole plan because you missed a week is what actually costs you the result.`),
    paragraph(`<strong>Is ${productName} suitable for complete beginners?</strong> It is aimed at people who have decided what they want and want the sequence laid out rather than assembled from scratch. If you have not done the goal-setting step yet, do that first.`),
  ]

  return {
    title,
    excerpt: `An honest, step-by-step look at what actually works in ${niche}, and where ${productName} fits in.`,
    html: sections.join(""),
  }
}
