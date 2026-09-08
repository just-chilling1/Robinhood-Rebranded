import { describe, expect, it } from "vitest"
import { parseArticlePayload } from "./article-payload"

const pack = JSON.stringify({ version: 1, videoId: "abc", videoTitle: "T", comments: ["one", "two"] })

describe("parseArticlePayload", () => {
  it("recognises a comment pack", () => {
    const result = parseArticlePayload(pack)
    expect(result.kind).toBe("pack")
    if (result.kind === "pack") expect(result.pack.comments).toHaveLength(2)
  })

  it("treats html as an article", () => {
    expect(parseArticlePayload("<p>Hello</p>").kind).toBe("html")
  })

  it("treats json without a comments array as html", () => {
    expect(parseArticlePayload('{"version":1,"videoId":"abc"}').kind).toBe("html")
  })

  it("reports empty content", () => {
    expect(parseArticlePayload("").kind).toBe("empty")
    expect(parseArticlePayload(null).kind).toBe("empty")
    expect(parseArticlePayload("   ").kind).toBe("empty")
  })
})
