import { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import { storm } from "@/lib/testFixtures";
import {
  getCountryFromSlug,
  getCountryPositionGroups,
  getCountryPositions,
  getCountrySlug,
  getCountryStorms,
} from "@/lib/utils/country";

describe("getCountrySlug", () => {
  it("lowercases and hyphenates multi-word names", () => {
    expect(getCountrySlug("RO Korea")).toBe("ro-korea");
    expect(getCountrySlug("HK, China")).toBe("hk-china");
  });

  it("drops the dots of an abbreviation", () => {
    expect(getCountrySlug("U.S.A.")).toBe("usa");
  });

  it("gives every member a distinct slug", () => {
    const slugs = COUNTRY_NAMES.map(getCountrySlug);
    expect(new Set(slugs).size).toBe(COUNTRY_NAMES.length);
  });
});

describe("getCountryFromSlug", () => {
  it("round-trips every member", () => {
    COUNTRY_NAMES.forEach((country) => {
      expect(getCountryFromSlug(getCountrySlug(country))).toBe(country);
    });
  });

  it("accepts an uppercase slug", () => {
    expect(getCountryFromSlug("HK-CHINA")).toBe("HK, China");
  });

  it("rejects an unknown slug", () => {
    expect(getCountryFromSlug("atlantis")).toBeNull();
    expect(getCountryFromSlug("")).toBeNull();
  });
});

describe("getCountryPositions", () => {
  it("returns the member's column in each of the ten rows", () => {
    expect(getCountryPositions(COUNTRY_NAMES[0])).toEqual([
      1, 15, 29, 43, 57, 71, 85, 99, 113, 127,
    ]);
    expect(getCountryPositions(COUNTRY_NAMES[13])).toEqual([
      14, 28, 42, 56, 70, 84, 98, 112, 126, 140,
    ]);
  });

  it("returns nothing for a non-member", () => {
    expect(getCountryPositions("Atlantis")).toEqual([]);
  });
});

describe("getCountryStorms", () => {
  it("keeps the member's grid storms and drops agency positions", () => {
    const storms = [
      storm({ name: "Mine", country: "Japan", position: 5 }),
      storm({ name: "Agency", country: "Japan", position: 142 }),
      storm({ name: "Other", country: "China", position: 2 }),
    ];
    expect(getCountryStorms(storms, "Japan").map((s) => s.name)).toEqual(["Mine"]);
  });
});

describe("getCountryPositionGroups", () => {
  it("lists all ten positions, each with its storms in year order", () => {
    const country = COUNTRY_NAMES[0];
    const groups = getCountryPositionGroups(
      [
        storm({ name: "B", position: 1, year: 2020 }),
        storm({ name: "A", position: 1, year: 2005 }),
      ],
      country,
    );
    expect(groups).toHaveLength(10);
    expect(groups[0][1].map((s) => s.name)).toEqual(["A", "B"]);
    expect(groups[1][1]).toEqual([]);
  });
});
