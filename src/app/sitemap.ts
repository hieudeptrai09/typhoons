import {
  getCanonicalNamesSlugs,
  slugToPath as namesSlugToPath,
} from "@/app/(navbar)/names/_utils/routing";
import {
  getCanonicalStormsSlugs,
  paramsToPath,
  slugToParams,
} from "@/app/(navbar)/storms/_utils/routing";
import { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import { getNameList } from "@/lib/db/api/getNameList";
import { getStorms } from "@/lib/db/api/getStorms";
import { getCountrySlug } from "@/lib/utils/country";
import { getPositionSlug } from "@/lib/utils/position";
import { getSeasonYears } from "@/lib/utils/storms";
import type { MetadataRoute } from "next";

const BASE_URL = "https://typhoons.vercel.app";

const pathDepth = (path: string): number => path.split("/").filter(Boolean).length;
const priorityForPath = (path: string): number => (10 - pathDepth(path)) / 10;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [nameList, stormList] = await Promise.all([getNameList(), getStorms()]);

  const stormsPages: MetadataRoute.Sitemap = getCanonicalStormsSlugs().map((slug) => {
    const path = paramsToPath(slugToParams(slug));
    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date("2026-07-19"),
      changeFrequency: "monthly",
      priority: priorityForPath(path),
    };
  });

  const namesPages: MetadataRoute.Sitemap = getCanonicalNamesSlugs().map((slug) => {
    const path = namesSlugToPath(slug);
    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date("2026-06-24"),
      changeFrequency: "monthly",
      priority: priorityForPath(path),
    };
  });

  const infoPages: MetadataRoute.Sitemap = (nameList?.data ?? []).map((name) => {
    const path = `/info/${name.toLowerCase()}/`;
    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date("2026-07-19"),
      changeFrequency: "monthly",
      priority: priorityForPath(path),
    };
  });

  const positionPages: MetadataRoute.Sitemap = Array.from({ length: 143 }, (_, i) => {
    const path = `/positions/${getPositionSlug(i + 1)}/`;
    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date("2026-07-19"),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  const indexPages: MetadataRoute.Sitemap = ["/info/", "/positions/", "/countries/", "/years/"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date("2026-09-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const countryPages: MetadataRoute.Sitemap = COUNTRY_NAMES.map((country) => ({
    url: `${BASE_URL}/countries/${getCountrySlug(country)}/`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const yearPages: MetadataRoute.Sitemap = getSeasonYears(stormList?.data ?? []).map((year) => ({
    url: `${BASE_URL}/years/${year}/`,
    lastModified: new Date("2026-09-14"),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date("2026-07-19"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...stormsPages,
    ...indexPages,
    ...namesPages,
    ...infoPages,
    ...positionPages,
    ...countryPages,
    ...yearPages,
  ];
}
