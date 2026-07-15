const CONDENSE_ABOVE = 60;
const HARD_LIMIT = 80;

const CLAUSE_BOUNDARY = /,| \(| which | whose | that | also /i;

export function condenseMeaning(meaning: string): string {
  const trimmed = meaning.trim();
  if (trimmed.length <= CONDENSE_ABOVE) return trimmed;

  const boundary = trimmed.search(CLAUSE_BOUNDARY);
  const head = (boundary === -1 ? trimmed : trimmed.slice(0, boundary))
    .trim()
    .replace(/[.,;:]$/, "");

  if (head.length <= HARD_LIMIT) return head;
  return head.slice(0, HARD_LIMIT).replace(/\s+\S*$/, "") + "…";
}

const TIERS: { max: number; size: number }[] = [
  { max: 12, size: 64 },
  { max: 25, size: 44 },
  { max: 72, size: 32 },
  { max: Infinity, size: 26 },
];

export function meaningFontSize(length: number): number {
  return TIERS.find((tier) => length <= tier.max)!.size;
}

const NAME_TIERS: { max: number; size: number }[] = [
  { max: 6, size: 150 },
  { max: 8, size: 132 },
  { max: Infinity, size: 112 },
];

export function nameFontSize(length: number): number {
  return NAME_TIERS.find((tier) => length <= tier.max)!.size;
}
