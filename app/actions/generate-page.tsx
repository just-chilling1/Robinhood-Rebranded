"use server"

/**
 * Deprecated: the original app used this action to generate affiliate pages.
 * RH repurposes the product to generate YouTube comment packs instead.
 *
 * This stub remains only to avoid accidental imports breaking builds.
 */
export default async function generatePageAction() {
  return {
    success: false,
    error: "This action has been replaced. Use generate-comment-pack instead.",
  }
}


