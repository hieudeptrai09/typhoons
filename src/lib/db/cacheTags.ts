// Every query below is cached with `revalidate: false`: the data changes a few times a
// year, not on a timer, so pages are written once per deploy and then only when one of
// these tags is revalidated through /api/revalidate.
export const CACHE_TAGS = {
  storms: "storms",
  names: "names",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const ALL_CACHE_TAGS: CacheTag[] = Object.values(CACHE_TAGS);

export const isCacheTag = (value: string): value is CacheTag =>
  (ALL_CACHE_TAGS as string[]).includes(value);
