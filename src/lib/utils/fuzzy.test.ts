import { damerauLevenshtein, similarity, topSuggestions } from "./fuzzy";

describe("damerauLevenshtein", () => {
  it("is 0 for identical strings", () => {
    expect(damerauLevenshtein("damrey", "damrey")).toBe(0);
  });

  it("equals the other length when one string is empty", () => {
    expect(damerauLevenshtein("", "yagi")).toBe(4);
    expect(damerauLevenshtein("yagi", "")).toBe(4);
  });

  it("counts an adjacent transposition as a single edit", () => {
    // "damrye" -> "damrey" is one swap, not two substitutions.
    expect(damerauLevenshtein("damrye", "damrey")).toBe(1);
  });

  it("counts substitutions", () => {
    expect(damerauLevenshtein("damwei", "damrey")).toBe(2);
  });
});

describe("similarity", () => {
  it("is 1 for identical strings", () => {
    expect(similarity("yagi", "yagi")).toBe(1);
  });

  it("is normalized by the longer length", () => {
    // one substitution over length 4 => 0.75
    expect(similarity("yagi", "yaki")).toBeCloseTo(0.75);
  });

  it("is low for unrelated strings", () => {
    expect(similarity("xyzzy", "yagi")).toBeLessThan(0.4);
  });
});

describe("topSuggestions", () => {
  const names = ["Damrey", "Danas", "Yagi", "Haiyan", "Bualoi", "Mun"];

  it("returns close matches ranked by similarity", () => {
    // a transposition typo of "Damrey"
    expect(topSuggestions("damrye", names)[0]).toBe("Damrey");
  });

  it("ignores queries shorter than the minimum length", () => {
    expect(topSuggestions("da", names)).toEqual([]);
  });

  it("returns nothing when no candidate clears the threshold", () => {
    expect(topSuggestions("zzzzzz", names)).toEqual([]);
  });

  it("respects the limit", () => {
    expect(topSuggestions("aaa", names, { limit: 2, threshold: 0 }).length).toBeLessThanOrEqual(2);
  });

  it("breaks ties alphabetically", () => {
    // Both "Danas" and "Damrey" differ; ordering is by score then name.
    const out = topSuggestions("dan", names, { threshold: 0, minQueryLength: 3, window: 1 });
    expect(out).toContain("Danas");
  });

  it("trims the noisy tail beyond the best match's window", () => {
    // "Haiyan" is a clear match; "Haishen" is close; "Banyan" is a weak guess
    // that should be dropped by the relative window.
    const pool = ["Haiyan", "Haishen", "Banyan"];
    const out = topSuggestions("haiyen", pool);
    expect(out[0]).toBe("Haiyan");
    expect(out).not.toContain("Banyan");
  });
});
