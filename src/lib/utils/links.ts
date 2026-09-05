import { getPositionSlug } from "@/lib/utils/position";

// Every list in the app drills into the same two screens, so the hrefs are built in one place.
// Both carry the trailing slash `trailingSlash: true` would otherwise redirect to.
export const infoHref = (name: string): string =>
  `/info/${encodeURIComponent(name.toLowerCase())}/`;

export const positionHref = (position: number): string =>
  `/positions/${getPositionSlug(position)}/`;
