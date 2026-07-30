import {
  capitalize,
  daysBetween,
  DELIMITER,
  fmt,
  formatStormDateRange,
  getPositionFromSlug,
  getPositionSlug,
  getPositionTitle,
  getZoomEarthUrl,
  normalizeParam,
  parseDateParts,
  parsePositionLabel,
  positionColumnLetter,
  removeFromDelimitedString,
  toArr,
  toOpts,
  toStr,
} from "@/lib/utils/fns";

describe("positionColumnLetter", () => {
  it("letters the grid columns A through N", () => {
    expect(positionColumnLetter(0)).toBe("A");
    expect(positionColumnLetter(13)).toBe("N");
  });
});

describe("getPositionTitle", () => {
  it("maps the external-basin positions to their agency", () => {
    expect(getPositionTitle(141)).toBe("CPHC");
    expect(getPositionTitle(142)).toBe("NHC");
    expect(getPositionTitle(143)).toBe("IMD");
  });

  it("maps a grid position to its row + column letter", () => {
    expect(getPositionTitle(1)).toBe("1A");
    expect(getPositionTitle(14)).toBe("1N"); // last column of row 1
    expect(getPositionTitle(15)).toBe("2A"); // wraps to the next row
    expect(getPositionTitle(37)).toBe("3I");
    expect(getPositionTitle(140)).toBe("10N"); // last cell of the grid
  });

  it("falls back to #n outside the 1-140 grid", () => {
    expect(getPositionTitle(0)).toBe("#0");
    expect(getPositionTitle(144)).toBe("#144");
    expect(getPositionTitle(1.5)).toBe("#1.5");
  });
});

describe("parsePositionLabel", () => {
  it("parses a grid label, case-insensitively", () => {
    expect(parsePositionLabel("3I")).toBe(37);
    expect(parsePositionLabel("3i")).toBe(37);
    expect(parsePositionLabel("  3I  ")).toBe(37);
    expect(parsePositionLabel("1A")).toBe(1);
    expect(parsePositionLabel("10N")).toBe(140);
  });

  it("parses a plain position number", () => {
    expect(parsePositionLabel("37")).toBe(37);
    expect(parsePositionLabel("140")).toBe(140);
  });

  it("rejects anything outside the grid", () => {
    expect(parsePositionLabel("")).toBeNull();
    expect(parsePositionLabel("   ")).toBeNull();
    expect(parsePositionLabel("11A")).toBeNull(); // row past 10
    expect(parsePositionLabel("0A")).toBeNull(); // row before 1
    expect(parsePositionLabel("3O")).toBeNull(); // column past N
    expect(parsePositionLabel("0")).toBeNull();
    expect(parsePositionLabel("141")).toBeNull(); // external basins aren't grid cells
    expect(parsePositionLabel("abc")).toBeNull();
  });

  it("round-trips against getPositionTitle across the whole grid", () => {
    for (let position = 1; position <= 140; position++) {
      expect(parsePositionLabel(getPositionTitle(position))).toBe(position);
    }
  });
});

describe("position slugs", () => {
  it("slugs the external basins by agency and grid cells by lowercase label", () => {
    expect(getPositionSlug(141)).toBe("cphc");
    expect(getPositionSlug(37)).toBe("3i");
    expect(getPositionSlug(1)).toBe("1a");
    expect(getPositionSlug(140)).toBe("10n");
  });

  it("keeps digits for positions that have no grid label", () => {
    expect(getPositionSlug(999)).toBe("999");
    expect(getPositionSlug(0)).toBe("0");
  });

  it("round-trips every position the sitemap emits", () => {
    for (let position = 1; position <= 143; position++) {
      expect(getPositionFromSlug(getPositionSlug(position))).toBe(position);
    }
  });

  it("is the lowercase of the title for every grid cell", () => {
    for (let position = 1; position <= 140; position++) {
      expect(getPositionSlug(position)).toBe(getPositionTitle(position).toLowerCase());
    }
  });

  // The canonical slug is "3i", so these are the spellings the page redirects onto it.
  it("also accepts the uppercase label and the plain number as a slug", () => {
    expect(getPositionFromSlug("3i")).toBe(37);
    expect(getPositionFromSlug("3I")).toBe(37);
    expect(getPositionFromSlug("37")).toBe(37);
  });

  it("rejects a non-numeric slug", () => {
    expect(getPositionFromSlug("abc")).toBeNull();
    expect(getPositionFromSlug("3.5")).toBeNull();
    expect(getPositionFromSlug("")).toBeNull();
  });

  it("passes out-of-grid integers through for the caller to range-check", () => {
    expect(getPositionFromSlug("999")).toBe(999);
    expect(getPositionFromSlug("0")).toBe(0);
  });
});

describe("normalizeParam", () => {
  it("takes the first entry of a repeated query param", () => {
    expect(normalizeParam(["a", "b"])).toBe("a");
  });

  it("collapses every empty form to an empty string", () => {
    expect(normalizeParam([])).toBe("");
    expect(normalizeParam(undefined)).toBe("");
    expect(normalizeParam("")).toBe("");
  });

  it("passes a single value through", () => {
    expect(normalizeParam("retired")).toBe("retired");
  });
});

describe("delimited filter values", () => {
  it("splits and joins on the delimiter", () => {
    expect(toArr(`Japan${DELIMITER}Vietnam`)).toEqual(["Japan", "Vietnam"]);
    expect(toStr(["Japan", "Vietnam"])).toBe(`Japan${DELIMITER}Vietnam`);
  });

  it("treats an empty or absent value as no selection", () => {
    expect(toArr("")).toEqual([]);
    expect(toStr(undefined)).toBe("");
    expect(toStr([])).toBe("");
  });

  it("drops empty segments left by a stale delimiter", () => {
    expect(toArr("Japan||Vietnam")).toEqual(["Japan", "Vietnam"]);
  });

  it("removes one selection while keeping the rest", () => {
    expect(removeFromDelimitedString("Japan|Vietnam|Thailand", "Vietnam")).toBe("Japan|Thailand");
  });

  it("leaves an empty string when the last selection is removed", () => {
    expect(removeFromDelimitedString("Japan", "Japan")).toBe("");
  });

  it("leaves the value alone when the item is not selected", () => {
    expect(removeFromDelimitedString("Japan|Vietnam", "Laos PDR")).toBe("Japan|Vietnam");
  });

  it("renders a selection for display", () => {
    expect(fmt("Japan|Vietnam")).toBe("Japan, Vietnam");
    expect(fmt("")).toBe("");
  });

  it("builds select options", () => {
    expect(toOpts(["Animal", "Plant"])).toEqual([
      { label: "Animal", value: "Animal" },
      { label: "Plant", value: "Plant" },
    ]);
  });
});

describe("capitalize", () => {
  it("uppercases the first character only", () => {
    expect(capitalize("strongest")).toBe("Strongest");
    expect(capitalize("avgdate")).toBe("Avgdate");
  });

  it("tolerates an empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("getZoomEarthUrl", () => {
  it("builds a slugged storm URL", () => {
    expect(getZoomEarthUrl("Yagi", 2024)).toBe("https://zoom.earth/storms/yagi-2024/");
  });

  it("trims and hyphenates a multi-word name", () => {
    expect(getZoomEarthUrl("  Tropical Depression  ", 2001)).toBe(
      "https://zoom.earth/storms/tropical-depression-2001/",
    );
  });
});

describe("parseDateParts", () => {
  it("splits a YYYY-MM-DD string", () => {
    expect(parseDateParts("2024-08-31")).toEqual({ year: 2024, month: 8, day: 31 });
  });

  it("returns null for anything it cannot fully parse", () => {
    expect(parseDateParts(undefined)).toBeNull();
    expect(parseDateParts("")).toBeNull();
    expect(parseDateParts("2024-08")).toBeNull(); // no day
    expect(parseDateParts("not-a-date")).toBeNull();
  });

  it("trusts the DB rather than range-checking the parts", () => {
    expect(parseDateParts("2024-13-45")).toEqual({ year: 2024, month: 13, day: 45 });
  });
});

describe("daysBetween", () => {
  it("counts the days spanned by a storm", () => {
    expect(daysBetween("2024-08-31", "2024-09-09")).toBe(9);
  });

  it("returns 0 for a single-day storm", () => {
    expect(daysBetween("2024-08-31", "2024-08-31")).toBe(0);
  });

  it("counts across a year boundary", () => {
    expect(daysBetween("2023-12-30", "2024-01-02")).toBe(3);
  });

  it("counts across a leap day", () => {
    expect(daysBetween("2024-02-28", "2024-03-01")).toBe(2);
  });

  it("returns null while a storm is still ongoing", () => {
    expect(daysBetween("2024-08-31", undefined)).toBeNull();
    expect(daysBetween(undefined, "2024-09-09")).toBeNull();
  });

  it("goes negative for a reversed range rather than clamping", () => {
    expect(daysBetween("2024-09-09", "2024-08-31")).toBe(-9);
  });
});

describe("formatStormDateRange", () => {
  it("omits the year on the start when both ends share it", () => {
    expect(formatStormDateRange("2024-08-31", "2024-09-09")).toBe("31/8 - 9/9/2024");
  });

  it("shows both years when the storm crosses into a new one", () => {
    expect(formatStormDateRange("2023-12-30", "2024-01-02")).toBe("30/12/2023 - 2/1/2024");
  });

  it("marks an ongoing storm as running to now", () => {
    expect(formatStormDateRange("2024-08-31", undefined)).toBe("31/8 - now");
  });

  it("returns null when there is no start date at all", () => {
    expect(formatStormDateRange(undefined, "2024-09-09")).toBeNull();
  });
});
