import { getDashboardDescription, getDashboardTitle } from "@/app/(navbar)/storms/_utils/metadata";
import { getCanonicalStormsSlugs, slugToParams } from "@/app/(navbar)/storms/_utils/routing";
import { INTENSITY_SLUGS_BY_STRENGTH } from "@/lib/utils/intensity";

const title = (slug: string[]) => getDashboardTitle(slugToParams(slug));
const description = (slug: string[]) => getDashboardDescription(slugToParams(slug));

describe("getDashboardTitle", () => {
  it("titles the storms view by its filter", () => {
    expect(title(["all", "position"])).toBe("All Storms by Position");
    expect(title(["all", "name"])).toBe("All Storms by Name");
  });

  it("capitalizes the filter into the records and stats titles", () => {
    expect(title(["records", "season", "strongest"])).toBe("Strongest Typhoons by Position");
    expect(title(["stats", "intensity", "country"])).toBe("Average Intensity by Country");
    expect(title(["stats", "gap", "name"])).toBe("Average Storm Recurrence by Name");
    expect(title(["stats", "dates", "position"])).toBe("Average Storm Dates by Position");
  });

  it("names the category in full rather than echoing the slug", () => {
    expect(title(["records", "category", "md"])).toBe("Monsoon Depressions by Position");
    expect(title(["records", "category", "cat5", "list"])).toBe(
      "Category 5 Super Typhoons by Position",
    );
    expect(title(["records", "category", "bogus"])).toBe("Storms by Intensity");
  });

  it("names the question a calendar page asks instead of capitalizing its filter", () => {
    expect(title(["calendar", "started"])).toBe("Seasons by Storm Start Date");
    expect(title(["calendar", "ended"])).toBe("Seasons by Storm End Date");
    expect(title(["calendar", "active"])).toBe("Seasons by Active Storm Date");
    expect(title(["calendar", "todate"])).toBe("Season Pace by Date");
    expect(title(["calendar", "bogus"])).toBe("Storms by Calendar Date");
  });

  it("gives every calendar page its own description", () => {
    const descriptions = ["started", "ended", "active", "todate"].map((filter) =>
      description(["calendar", filter]),
    );
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("gives every category page its own description", () => {
    const descriptions = INTENSITY_SLUGS_BY_STRENGTH.map((filter) =>
      description(["records", "category", filter]),
    );
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("falls back to the all-storms title rather than returning nothing", () => {
    expect(title(["bogus", "bogus"])).toBe("All Storms by Name");
  });
});

describe("getDashboardDescription", () => {
  it("describes each storms mode differently", () => {
    const table = description(["all", "position"]);
    const list = description(["all", "name", "list"]);
    expect(table).not.toBe(list);
    expect(table.length).toBeGreaterThan(0);
  });

  it("has a description for every canonical page", () => {
    for (const slug of getCanonicalStormsSlugs()) {
      expect(description(slug).length).toBeGreaterThan(0);
    }
  });

  it("falls back rather than returning nothing for an unknown filter", () => {
    expect(description(["stats", "intensity", "bogus"]).length).toBeGreaterThan(0);
    expect(description(["bogus", "bogus"]).length).toBeGreaterThan(0);
  });
});
