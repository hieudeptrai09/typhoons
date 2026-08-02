import sql from "@/lib/db";

export interface CommitteeDigestName {
  name: string;
  position: number;
  isReplaced: boolean;
  replacementName: string;
}

export interface CommitteeDigest {
  season: number;
  names: CommitteeDigestName[];
  title: string;
  body: string;
  url: string;
  dedupeKey: string;
}

interface DigestRow {
  name: string;
  position: number;
  isReplaced: boolean;
  replacementName: string;
}

const joinNames = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
};

// The committee's report lands the May after the season it covers, so that season is the
// default subject of the digest.
export const defaultDigestSeason = (): number => new Date().getFullYear() - 1;

export async function getCommitteeDigest(season: number): Promise<CommitteeDigest> {
  const rows = await sql.query<DigestRow[]>(
    `SELECT name, position, isreplaced AS "isReplaced", replacementname AS "replacementName"
     FROM typhoonnames
     WHERE isretired = true AND lastyear = $1 AND position <= 140
     ORDER BY position ASC`,
    [season],
  );

  const names: CommitteeDigestName[] = rows.map((row) => ({
    name: row.name,
    position: Number(row.position),
    isReplaced: row.isReplaced,
    replacementName: row.replacementName,
  }));

  const retired = names.map((entry) => entry.name);
  const replacements = names
    .filter((entry) => entry.isReplaced && entry.replacementName)
    .map((entry) => entry.replacementName);
  const pending = names.filter((entry) => !entry.isReplaced).length;

  const sentences: string[] = [];

  if (retired.length === 0) {
    sentences.push(`No names were retired from the ${season} season.`);
  } else {
    sentences.push(
      `${joinNames(retired)} ${retired.length === 1 ? "has" : "have"} been retired from the naming list.`,
    );
  }

  if (replacements.length > 0) {
    sentences.push(
      `${replacements.length === 1 ? "Replacement" : "Replacements"}: ${joinNames(replacements)}.`,
    );
  }

  // The schema allows isretired without isreplaced — retired while the committee is still
  // choosing — and that pending state is worth saying out loud rather than hiding.
  if (pending > 0) {
    sentences.push(`${pending} still under review.`);
  }

  return {
    season,
    names,
    title: `Typhoon Committee: the ${season} retirements`,
    body: sentences.join(" "),
    // No single storm is the subject, so the digest lands on the retired list.
    url: "/names/retired/",
    dedupeKey: `committee:${season}`,
  };
}
