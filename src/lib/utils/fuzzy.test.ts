import { damerauLevenshtein, similarity, topSuggestions } from "@/lib/utils/fuzzy";

// A slice of the real name pool: the crowded N- cluster that motivated edit distance over
// trigrams, plus a few longer names and the hyphenated spellings.
const NAMES = [
  "Bopha",
  "Bori",
  "Goni",
  "Hagibis",
  "Haiyan",
  "Haishen",
  "Kong-rey",
  "Mangkhut",
  "Nakri",
  "Nari",
  "Noguri",
  "Noru",
  "Noul",
  "Nuri",
  "Rai",
  "Trami",
  "Usagi",
  "Wipha",
  "Yagi",
];

describe("damerauLevenshtein", () => {
  it("counts each edit once", () => {
    expect(damerauLevenshtein("nori", "nuri")).toBe(1); // substitution
    expect(damerauLevenshtein("nori", "nori")).toBe(0);
    expect(damerauLevenshtein("konrey", "kongrey")).toBe(1); // insertion
    expect(damerauLevenshtein("noguri", "noguri")).toBe(0);
  });

  it("charges an adjacent swap as one edit, not two", () => {
    expect(damerauLevenshtein("yagi", "yaig")).toBe(1);
    expect(damerauLevenshtein("trami", "tramai")).toBe(1);
  });

  it("falls back to the other string's length when one is empty", () => {
    expect(damerauLevenshtein("", "yagi")).toBe(4);
    expect(damerauLevenshtein("yagi", "")).toBe(4);
    expect(damerauLevenshtein("", "")).toBe(0);
  });
});

describe("similarity", () => {
  it("scores identical strings 1 and normalizes by the longer length", () => {
    expect(similarity("yagi", "yagi")).toBe(1);
    expect(similarity("nori", "nuri")).toBeCloseTo(0.75); // 1 edit over 4 chars
  });

  // The whole reason this module exists: trigram similarity puts these at 0.25, under
  // pg_trgm's 0.3 default, so a one-letter typo on a four-letter name found nothing.
  it("keeps one-letter typos on short names well above any usable threshold", () => {
    for (const name of ["Nuri", "Nari", "Noru", "Bori"]) {
      expect(similarity("nori", name.toLowerCase())).toBeGreaterThan(0.7);
    }
  });
});

describe("topSuggestions", () => {
  it("returns every one-edit neighbour of an ambiguous short name", () => {
    // The Nori case: four names sit one edit away and none of them outranks the others.
    expect(topSuggestions("Nori", NAMES)).toEqual(["Bori", "Nari", "Noru", "Nuri", "Noguri"]);
  });

  it("puts the intended name first for a plain misspelling", () => {
    expect(topSuggestions("hagibys", NAMES)[0]).toBe("Hagibis");
    expect(topSuggestions("mankhut", NAMES)[0]).toBe("Mangkhut");
    expect(topSuggestions("konrey", NAMES)[0]).toBe("Kong-rey");
    expect(topSuggestions("wypha", NAMES)[0]).toBe("Wipha");
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    expect(topSuggestions("  YAGY  ", NAMES)).toEqual(["Yagi"]);
  });

  it("returns nothing for a query that resembles no name", () => {
    expect(topSuggestions("zzzzzz", NAMES)).toEqual([]);
    expect(topSuggestions("aaaaaaaaaa", NAMES)).toEqual([]);
  });

  it("stays quiet on queries too short to be a meaningful typo", () => {
    // "no" is one edit from Noru and Noul, but two characters aren't enough to guess from.
    expect(topSuggestions("no", NAMES)).toEqual([]);
    expect(topSuggestions("", NAMES)).toEqual([]);
  });

  it("drops matches that trail far behind the best one", () => {
    // Rai is an exact hit, so the 0.2 window keeps Nari and Bori (0.5) out.
    expect(topSuggestions("rai", NAMES)).toEqual(["Rai"]);
  });

  it("honours limit and threshold overrides", () => {
    expect(topSuggestions("Nori", NAMES, { limit: 2 })).toEqual(["Bori", "Nari"]);
    expect(topSuggestions("Nori", NAMES, { threshold: 0.9 })).toEqual([]);
    expect(topSuggestions("no", NAMES, { minQueryLength: 2, window: 0 })).toEqual(["Noru", "Noul"]);
  });
});
