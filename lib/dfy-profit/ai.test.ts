import { describe, expect, it } from "vitest"
import { extractJsonFromText } from "./ai"

describe("extractJsonFromText", () => {
  it("parses a bare object", () => {
    expect(extractJsonFromText('{"a":1}')).toEqual({ a: 1 })
  })

  it("parses a fenced json block", () => {
    expect(extractJsonFromText('```json\n{"a":2}\n```')).toEqual({ a: 2 })
  })

  it("parses an object embedded in prose", () => {
    expect(extractJsonFromText('Sure! Here you go: {"a":3} Hope that helps.')).toEqual({ a: 3 })
  })

  it("parses a bare array", () => {
    expect(extractJsonFromText("[1,2,3]")).toEqual([1, 2, 3])
  })

  it("returns null for unparseable text", () => {
    expect(extractJsonFromText("no json here")).toBeNull()
  })
})
