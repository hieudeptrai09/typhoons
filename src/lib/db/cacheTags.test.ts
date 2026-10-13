import { CACHE_TAGS, isCacheTag, nameTag, positionTag, yearTag } from "@/lib/db/cacheTags";

describe("isCacheTag", () => {
  it("accepts every static tag", () => {
    Object.values(CACHE_TAGS).forEach((tag) => expect(isCacheTag(tag)).toBe(true));
  });

  it("accepts the tags the helpers build", () => {
    expect(isCacheTag(nameTag("Kong-rey"))).toBe(true);
    expect(isCacheTag(positionTag(141))).toBe(true);
    expect(isCacheTag(yearTag(2026))).toBe(true);
  });

  it("rejects unknown and malformed tags", () => {
    expect(isCacheTag("everything")).toBe(false);
    expect(isCacheTag("position:abc")).toBe(false);
    expect(isCacheTag("year:26")).toBe(false);
    expect(isCacheTag("name:")).toBe(false);
    // Next joins a page's tags with commas.
    expect(isCacheTag("name:a,b")).toBe(false);
  });
});

describe("nameTag", () => {
  it("lowercases, matching the webhook's lower(name)", () => {
    expect(nameTag("Bang-Lang")).toBe(nameTag("Bang-lang"));
  });
});
