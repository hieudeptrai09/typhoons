// Queries are cached with `revalidate: false` and refreshed only when the Supabase webhooks
// (db/revalidate-webhooks.sql) hit /api/revalidate with these tags. Tags are as narrow as the
// pages they feed; the webhooks decide which tags a row change touches, so keep the two in step.
export const CACHE_TAGS = {
  all: "db", // every query; revalidated alone for positions and imagelicenses
  storms: "storms",
  stormIndex: "storm-index", // name, position and year of every storm, no details
  stormYears: "storm-years",
  names: "names",
  nameList: "name-list", // every linkable name (navbar search, info index)
  suggestions: "suggestions",
  facts: "facts",
} as const;

export const nameTag = (name: string): string => `name:${name.toLowerCase()}`;
export const positionTag = (position: number): string => `position:${position}`;
export const yearTag = (year: number): string => `year:${year}`;

const STATIC_TAGS: string[] = Object.values(CACHE_TAGS);

// Next joins a page's tags with commas, so a comma inside a tag would split it in two.
const PARAMETERISED_TAG = /^(name:[^,]{1,64}|position:\d{1,3}|year:\d{4})$/;

export const isCacheTag = (value: string): boolean =>
  STATIC_TAGS.includes(value) || PARAMETERISED_TAG.test(value);
