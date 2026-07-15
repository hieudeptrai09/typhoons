import sql, { type QueryParam } from "@/lib/db";

type Row = Record<string, unknown>;

const MONTH_NAMES: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function joinNames(items: (string | number)[], joiner = "and"): string {
  const arr = items.map(String);
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} ${joiner} ${arr[1]}`;
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, -1);
  return `${rest.join(", ")} ${joiner} ${last}`;
}

// Builds "<clause>, which is/are <names>." so a count and its name list stay one fact.
function withNames(clause: string, items: (string | number)[]): string {
  const verb = items.length === 1 ? "which is" : "which are";
  return `${clause}, ${verb} ${joinNames(items)}.`;
}

async function rows(query: string, params: QueryParam[] = []): Promise<Row[]> {
  return sql.query<Row[]>(query, params);
}

async function one(query: string, params: QueryParam[] = []): Promise<Row | undefined> {
  return (await rows(query, params))[0];
}

async function generateFacts(): Promise<string[]> {
  const facts: string[] = [];

  // --- Cross-basin facts ---

  let names = (
    await rows("SELECT DISTINCT name FROM storms WHERE position = 141 ORDER BY name")
  ).map((r) => String(r.name));
  if (names.length > 0) {
    facts.push(
      withNames(
        `There are ${names.length} names given in Hawaiian by CPHC that crossed into the West Pacific basin`,
        names,
      ),
    );
  }

  names = (await rows("SELECT DISTINCT name FROM storms WHERE position = 142 ORDER BY name")).map(
    (r) => String(r.name),
  );
  if (names.length > 0) {
    facts.push(
      withNames(
        `Besides Li (1994), there are ${names.length} names assigned by NHC that cross 3 Pacific basins`,
        names,
      ),
    );
  }

  let rowsResult = await rows(
    "SELECT name, COUNT(*) as cnt FROM storms WHERE position = 142 GROUP BY name HAVING COUNT(*) >= 2",
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label =
      names.length === 1 ? "is the only name that was given" : "are the only names that were given";
    facts.push(`${joinNames(names)} ${label} to 2 storms crossing 3 Pacific basins.`);
  }

  // --- Category 5 from external basins ---

  rowsResult = await rows(
    "SELECT DISTINCT name FROM storms WHERE position = 142 AND intensity = '5'",
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label =
      names.length === 1
        ? "is the only storm from NHC to reach category 5"
        : "are the storms from NHC that reached category 5";
    facts.push(`${joinNames(names)} ${label}.`);
  }

  rowsResult = await rows(
    "SELECT DISTINCT name FROM storms WHERE position = 141 AND intensity = '5'",
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label =
      names.length === 1
        ? "is the storm named in Hawaiian to reach category 5"
        : "are the storms named in Hawaiian that reached category 5";
    facts.push(`${joinNames(names)} ${label}.`);
  }

  // --- Indian Ocean to Pacific ---

  rowsResult = await rows("SELECT DISTINCT name FROM storms WHERE position = 143");
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the only storm" : "are the only storms";
    facts.push(
      `${joinNames(names)} ${label} that crossed from the Indian Ocean to the Pacific Ocean.`,
    );
  }

  // --- Weak storms retired for destructive reason ---

  rowsResult = await rows(`
    SELECT DISTINCT t.name, s.intensity FROM typhoonnames t
    INNER JOIN storms s ON t.name = s.name AND t.position = s.position AND s.year = t.lastyear
    WHERE t.isretired = true AND t.islanguageproblem = 0 AND t.position <= 140
    AND s.year >= 2000
    AND s.intensity IN ('TD', 'TS', 'STS')
    ORDER BY t.name
  `);
  const intensityLabels: Record<string, string> = {
    TD: "a tropical depression",
    TS: "a tropical storm",
    STS: "a severe tropical storm",
  };
  for (const r of rowsResult) {
    const label = intensityLabels[String(r.intensity)] ?? "a tropical storm";
    facts.push(
      `Although ${r.name} was only ${label}, it was retired due to the destruction it caused.`,
    );
  }

  // --- Strongest storms records ---

  rowsResult = await rows(
    `SELECT name, COUNT(*) as cnt FROM storms WHERE isstrongest = true AND year >= 2000 GROUP BY name HAVING COUNT(*) > 1`,
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the only name" : "are the only names";
    facts.push(`${joinNames(names)} ${label} with more than one record-strength storm.`);
  }

  // --- Strongest storms not Cat 5 ---

  rowsResult = await rows(
    `SELECT name, year, intensity FROM storms WHERE isstrongest = true AND intensity != '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label =
      items.length === 1
        ? "is the only record-strength storm"
        : "are the only record-strength storms";
    facts.push(`Since 2000, ${joinNames(items)} ${label} that did not reach category 5.`);
  }

  // --- First storms that are Cat 5 ---

  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE isfirst = true AND intensity = '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label =
      items.length === 1
        ? "is the only season-opening storm"
        : "are the only season-opening storms";
    facts.push(`Since 2000, ${joinNames(items)} ${label} to reach category 5.`);
  }

  // --- Storms spanning multiple years ---

  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE monthstart > 0 AND monthend > 0 AND dateend > 0 AND monthend < monthstart AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label = items.length === 1 ? "is the only storm" : "are the only storms";
    facts.push(`Since 2000, ${joinNames(items)} ${label} that span multiple years.`);
  }

  // --- Longest-lived storm ---

  rowsResult = await rows(`
    SELECT name, year, datestart, monthstart, dateend, monthend, isfromprevyear
    FROM storms
    WHERE position <= 140
    AND monthstart > 0 AND datestart > 0 AND monthend > 0 AND dateend > 0
  `);
  if (rowsResult.length > 0) {
    // Same start/end convention as getStormRange in ActiveStorms: isfromprevyear shifts the
    // start back a year, and an end month before the start month means it ran into the next.
    const durations = rowsResult.map((r) => {
      const year = Number(r.year);
      const monthStart = Number(r.monthstart);
      const startYear = r.isfromprevyear ? year - 1 : year;
      const startDate = new Date(startYear, monthStart - 1, Number(r.datestart));
      const endYear = Number(r.monthend) < monthStart ? startYear + 1 : startYear;
      const endDate = new Date(endYear, Number(r.monthend) - 1, Number(r.dateend));
      const days = Math.round((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
      return { label: `${r.name} (${year})`, days };
    });
    const maxDays = Math.max(...durations.map((d) => d.days));
    const longest = durations.filter((d) => d.days === maxDays).map((d) => d.label);
    const label =
      longest.length === 1
        ? "is the longest-lived storm, lasting"
        : "are the longest-lived storms, each lasting";
    facts.push(`Since 2000, ${joinNames(longest)} ${label} ${maxDays} days.`);
  }

  // --- Seasons ending with Cat 5 ---

  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE islast = true AND intensity = '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    facts.push(
      `Since 2000, there ${items.length === 1 ? "is" : "are"} ${items.length} season${
        items.length === 1 ? "" : "s"
      } that ended with a category 5 storm, which ended with ${joinNames(items)}.`,
    );
  }

  // --- Strongest storms in off-season months (per month) ---

  for (const month of [1, 2, 3, 4, 12]) {
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE isstrongest = true AND monthstart = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      const label =
        items.length === 1
          ? "is the only record-strength storm"
          : "are the only record-strength storms";
      facts.push(`Since 2000, ${joinNames(items)} ${label} to form in ${monthName}.`);
    }
  }

  // --- First storms in late months (per month) ---

  for (const month of [6, 7, 8]) {
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE isfirst = true AND monthstart = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      const label =
        items.length === 1
          ? "is the only season-opening storm"
          : "are the only season-opening storms";
      facts.push(`Since 2000, ${joinNames(items)} ${label} to form in ${monthName}.`);
    }
  }

  // --- Cat 5 in off-season months (per month) ---

  for (const month of [1, 2, 3, 4, 12]) {
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE intensity = '5' AND monthstart = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      facts.push(
        withNames(
          `Since 2000, there ${items.length === 1 ? "is" : "are"} only ${
            items.length
          } category 5 storm${items.length === 1 ? "" : "s"} that formed in ${monthName}`,
          items,
        ),
      );
    }
  }

  // --- Names never reaching typhoon intensity ---

  rowsResult = await rows(`
    SELECT t.name FROM typhoonnames t
    WHERE t.position <= 140 AND t.isretired = false
    AND NOT EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
        AND s.year >= 2000 AND s.intensity IN ('1','2','3','4','5')
    )
    AND EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position AND s.year >= 2000
    )
    ORDER BY t.name
  `);
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    facts.push(
      withNames(
        `There ${names.length === 1 ? "is" : "are"} ${names.length} storm name${
          names.length === 1 ? "" : "s"
        } that never reached typhoon intensity`,
        names,
      ),
    );
  }

  // --- Names where ALL appearances are Cat 5 (times >= 2) ---

  rowsResult = await rows(`
    SELECT name, COUNT(*) as total
    FROM storms WHERE position <= 140 AND year >= 2000
    GROUP BY name, position
    HAVING COUNT(*) >= 2 AND COUNT(*) = SUM(CASE WHEN intensity = '5' THEN 1 ELSE 0 END)
  `);
  let byCount = new Map<number, string[]>();
  for (const r of rowsResult) {
    const total = Number(r.total);
    if (!byCount.has(total)) byCount.set(total, []);
    byCount.get(total)!.push(String(r.name));
  }
  for (const [times, namesForCount] of byCount) {
    const label = namesForCount.length === 1 ? "is the only storm" : "are the only storms";
    facts.push(
      `${joinNames(namesForCount)} ${label} that appeared ${times} times, each time as a category 5 storm.`,
    );
  }

  // --- Names where ALL appearances are Cat 4 (times >= 2) ---

  rowsResult = await rows(`
    SELECT name, COUNT(*) as total
    FROM storms WHERE position <= 140 AND year >= 2000
    GROUP BY name, position
    HAVING COUNT(*) >= 2 AND COUNT(*) = SUM(CASE WHEN intensity = '4' THEN 1 ELSE 0 END)
  `);
  byCount = new Map<number, string[]>();
  for (const r of rowsResult) {
    const total = Number(r.total);
    if (!byCount.has(total)) byCount.set(total, []);
    byCount.get(total)!.push(String(r.name));
  }
  for (const [times, namesForCount] of byCount) {
    const label = namesForCount.length === 1 ? "is the only storm" : "are the only storms";
    facts.push(
      `${joinNames(namesForCount)} ${label} that appeared ${times} times, each time as a category 4 storm.`,
    );
  }

  // --- Total names and countries in WPAC ---

  let row = await one("SELECT COUNT(*) as cnt FROM typhoonnames WHERE position <= 140");
  const total = Number(row?.cnt ?? 0);
  row = await one(
    "SELECT COUNT(DISTINCT p.country) as cnt FROM typhoonnames t INNER JOIN positions p ON t.position = p.id WHERE t.position <= 140",
  );
  const countries = Number(row?.cnt ?? 0);
  facts.push(
    `There are ${total} storm names contributed by ${countries} countries in the western Pacific basin since 2000.`,
  );

  // --- Max used non-retired names ---

  row = await one(`
    SELECT MAX(storm_count) as max_count FROM (
        SELECT COUNT(s.id) as storm_count FROM typhoonnames t
        INNER JOIN storms s ON t.name = s.name AND t.position = s.position
        WHERE t.isretired = false AND t.position <= 140 AND s.year >= 2000
        GROUP BY t.name, t.position
    ) as sub
  `);
  const maxCount = Number(row?.max_count ?? 0);
  if (maxCount > 0) {
    rowsResult = await rows(
      `
      SELECT t.name FROM typhoonnames t
      INNER JOIN storms s ON t.name = s.name AND t.position = s.position
      WHERE t.isretired = false AND t.position <= 140 AND s.year >= 2000
      GROUP BY t.name, t.position HAVING COUNT(s.id) = $1
      ORDER BY t.name
      `,
      [maxCount],
    );
    if (rowsResult.length > 0) {
      names = rowsResult.map((r) => String(r.name));
      facts.push(
        withNames(
          `${names.length} name${names.length === 1 ? " has" : "s have"} been used ${maxCount} times since 2000 without being retired`,
          names,
        ),
      );
    }
  }

  // --- Country contributions ---

  row = await one(`
    SELECT p.country, COUNT(*) as cnt FROM typhoonnames t
    INNER JOIN positions p ON t.position = p.id
    WHERE t.position <= 140 GROUP BY p.country ORDER BY cnt DESC LIMIT 1
  `);
  if (row) {
    facts.push(`${row.country} has contributed the most names (${row.cnt}).`);
  }

  row = await one(`
    SELECT MIN(cnt) as min_cnt FROM (
        SELECT COUNT(*) as cnt FROM typhoonnames t
        INNER JOIN positions p ON t.position = p.id
        WHERE t.position <= 140 GROUP BY p.country
    ) as sub
  `);
  const minCnt = Number(row?.min_cnt ?? 0);
  rowsResult = await rows(
    `
    SELECT p.country FROM typhoonnames t
    INNER JOIN positions p ON t.position = p.id
    WHERE t.position <= 140 GROUP BY p.country HAVING COUNT(*) = $1 ORDER BY p.country
    `,
    [minCnt],
  );
  const leastCountries = rowsResult.map((r) => String(r.country));
  facts.push(`${joinNames(leastCountries)} contributed the fewest names (${minCnt}).`);

  // --- Year records ---

  row = await one(
    "SELECT year, COUNT(*) as cnt FROM storms WHERE year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1",
  );
  if (row) {
    facts.push(`Since 2000, ${row.year} had the most storms of any season, with ${row.cnt}.`);
  }

  // Only compare seasons up to last year.
  const lastCompleteYear = new Date().getFullYear() - 1;
  row = await one(
    `
    SELECT MIN(cnt) as min_cnt FROM (
        SELECT COUNT(*) as cnt FROM storms WHERE year >= 2000 AND year <= $1 GROUP BY year
    ) as sub
  `,
    [lastCompleteYear],
  );
  const minYearCnt = Number(row?.min_cnt ?? 0);
  rowsResult = await rows(
    "SELECT year FROM storms WHERE year >= 2000 AND year <= $1 GROUP BY year HAVING COUNT(*) = $2 ORDER BY year",
    [lastCompleteYear, minYearCnt],
  );
  const years = rowsResult.map((r) => Number(r.year));
  if (years.length > 0) {
    const label = years.length === 1 ? "the year" : "the years";
    const verb = years.length === 1 ? "is" : "are";
    facts.push(
      `Between 2000 and ${lastCompleteYear}, ${label} with the fewest storms (${minYearCnt}) ${verb} ${joinNames(years)}.`,
    );
  }

  row = await one(
    "SELECT year, COUNT(*) as cnt FROM storms WHERE intensity = '5' AND year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1",
  );
  if (row) {
    facts.push(`Since 2000, ${row.year} had the most category 5 storms of any season.`);
  }

  // --- Tag records ---

  row = await one(
    "SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt DESC LIMIT 1",
  );
  if (row) {
    facts.push(`${row.tag} is the category with the most names (${row.cnt}).`);
  }

  row = await one(
    "SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt ASC LIMIT 1",
  );
  if (row) {
    facts.push(`${row.tag} is the category with the fewest names (${row.cnt}).`);
  }

  // --- Rare languages ---

  rowsResult = await rows(
    "SELECT language, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY language HAVING COUNT(*) <= 3 ORDER BY cnt",
  );
  for (const r of rowsResult) {
    const langNames = (
      await rows(
        "SELECT name FROM typhoonnames WHERE position <= 140 AND language = $1 ORDER BY name",
        [String(r.language)],
      )
    ).map((nr) => String(nr.name));
    if (langNames.length > 0) {
      facts.push(
        withNames(
          `There ${langNames.length === 1 ? "is" : "are"} only ${langNames.length} name${
            langNames.length === 1 ? "" : "s"
          } from the ${r.language} language`,
          langNames,
        ),
      );
    }
  }

  // --- Names per tag ---

  rowsResult = await rows(
    "SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt",
  );
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    if (rCnt > 3) {
      facts.push(`There are ${rCnt} names in the category ${r.tag}.`);
      continue;
    }
    const tagNames = (
      await rows("SELECT name FROM typhoonnames WHERE position <= 140 AND tag = $1 ORDER BY name", [
        String(r.tag),
      ])
    ).map((nr) => String(nr.name));
    if (tagNames.length > 0) {
      facts.push(
        withNames(
          `There ${tagNames.length === 1 ? "is" : "are"} only ${tagNames.length} name${
            tagNames.length === 1 ? "" : "s"
          } in the category ${r.tag}`,
          tagNames,
        ),
      );
    }
  }

  // --- Category breakdown per language ---

  rowsResult = await rows(`
    SELECT language, tag, COUNT(*) as cnt FROM typhoonnames
    WHERE position <= 140 GROUP BY language, tag ORDER BY language, cnt DESC, tag
  `);
  const tagsByLanguage = new Map<string, string[]>();
  for (const r of rowsResult) {
    const language = String(r.language);
    if (!tagsByLanguage.has(language)) tagsByLanguage.set(language, []);
    tagsByLanguage.get(language)!.push(`${r.tag} (${r.cnt})`);
  }
  for (const [language, parts] of tagsByLanguage) {
    const label = parts.length === 1 ? "category" : "categories";
    facts.push(`The ${language} language has names in the ${label} ${joinNames(parts)}.`);
  }

  // --- Category breakdown per country ---

  rowsResult = await rows(`
    SELECT p.country, t.tag, COUNT(*) as cnt FROM typhoonnames t
    INNER JOIN positions p ON t.position = p.id
    WHERE t.position <= 140 GROUP BY p.country, t.tag ORDER BY p.country, cnt DESC, t.tag
  `);
  const tagsByCountry = new Map<string, string[]>();
  for (const r of rowsResult) {
    const country = String(r.country);
    if (!tagsByCountry.has(country)) tagsByCountry.set(country, []);
    tagsByCountry.get(country)!.push(`${r.tag} (${r.cnt})`);
  }
  for (const [country, parts] of tagsByCountry) {
    const label = parts.length === 1 ? "category" : "categories";
    facts.push(`${country} has contributed names in the ${label} ${joinNames(parts)}.`);
  }

  // --- Language reason retirements ---

  names = (
    await rows(
      `SELECT name FROM typhoonnames WHERE islanguageproblem = 1 AND isretired = true ORDER BY name`,
    )
  ).map((r) => String(r.name));
  if (names.length > 0) {
    facts.push(
      withNames(
        `There ${names.length === 1 ? "is" : "are"} ${names.length} name${
          names.length === 1 ? "" : "s"
        } retired for language-related reasons`,
        names,
      ),
    );
  }

  // --- Nearest equator ---

  rowsResult = await rows(`SELECT name FROM typhoonnames WHERE islanguageproblem = 3`);
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the storm" : "are the storms";
    facts.push(`${joinNames(names)} ${label} that formed closest to the equator on record.`);
  }

  // --- Retirement reasons with notes ---

  rowsResult = await rows(`
    SELECT name, note FROM typhoonnames
    WHERE islanguageproblem = 1 AND isretired = true AND note IS NOT NULL AND note != ''
  `);
  for (const r of rowsResult) {
    const reason = String(r.note);
    if (/^(has |was |is )/.test(reason)) {
      facts.push(`The name ${r.name} was retired because it ${reason}.`);
    } else if (/^resubmitted /.test(reason)) {
      facts.push(`The name ${r.name} was retired because it was ${reason}.`);
    } else {
      facts.push(`The name ${r.name} was retired due to its meaning: ${reason}.`);
    }
  }

  // --- Missing letters ---

  const allNames = (await rows("SELECT name FROM typhoonnames WHERE position <= 140")).map((r) =>
    String(r.name).toUpperCase(),
  );
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const firstLetters = new Set(allNames.map((n) => n[0]));
  const missingFirst = allLetters.filter((l) => !firstLetters.has(l));
  if (missingFirst.length > 0) {
    const label = missingFirst.length === 1 ? "letter" : "letters";
    facts.push(`No names start with the ${label} ${joinNames(missingFirst, "or")}.`);
  }

  const usedLetters = new Set(allNames.join("").split(""));
  const missingAnywhere = allLetters.filter((l) => !usedLetters.has(l));
  if (missingAnywhere.length > 0) {
    const label = missingAnywhere.length === 1 ? "letter" : "letters";
    facts.push(
      `No western Pacific names contain the ${label} ${joinNames(missingAnywhere, "or")} at all.`,
    );
  }

  // --- Letters with only active or only retired names ---

  rowsResult = await rows(`
    SELECT UPPER(LEFT(name, 1)) as letter,
           SUM(CASE WHEN isretired = false THEN 1 ELSE 0 END) as active_cnt,
           SUM(CASE WHEN isretired = true THEN 1 ELSE 0 END) as retired_cnt
    FROM typhoonnames WHERE position <= 140
    GROUP BY letter
  `);
  const onlyActive: string[] = [];
  const onlyRetired: string[] = [];
  for (const r of rowsResult) {
    const activeCnt = Number(r.active_cnt);
    const retiredCnt = Number(r.retired_cnt);
    if (activeCnt > 0 && retiredCnt === 0) {
      onlyActive.push(String(r.letter));
    } else if (retiredCnt > 0 && activeCnt === 0) {
      onlyRetired.push(String(r.letter));
    }
  }
  onlyActive.sort();
  onlyRetired.sort();
  if (onlyActive.length > 0) {
    const label = onlyActive.length === 1 ? "letter" : "letters";
    const verb = onlyActive.length === 1 ? "has" : "have";
    facts.push(
      `The ${label} ${joinNames(onlyActive)} ${verb} only active names (no retired names).`,
    );
  }
  if (onlyRetired.length > 0) {
    const label = onlyRetired.length === 1 ? "letter" : "letters";
    const verb = onlyRetired.length === 1 ? "has" : "have";
    facts.push(
      `The ${label} ${joinNames(onlyRetired)} ${verb} only retired names (no active names).`,
    );
  }

  // --- Rare starting letters ---

  rowsResult = await rows(`
    SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
    FROM typhoonnames WHERE position <= 140
    GROUP BY letter HAVING COUNT(*) <= 3 ORDER BY cnt, letter
  `);
  for (const r of rowsResult) {
    const letterNames = (
      await rows(
        "SELECT name FROM typhoonnames WHERE position <= 140 AND UPPER(LEFT(name, 1)) = $1 ORDER BY name",
        [String(r.letter)],
      )
    ).map((nr) => String(nr.name));
    if (letterNames.length > 0) {
      facts.push(
        withNames(
          `There ${letterNames.length === 1 ? "is" : "are"} only ${letterNames.length} name${
            letterNames.length === 1 ? "" : "s"
          } starting with the letter ${r.letter}`,
          letterNames,
        ),
      );
    }
  }

  // --- Most/least common starting letter ---

  row = await one(`
    SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
    FROM typhoonnames WHERE position <= 140
    GROUP BY letter ORDER BY cnt DESC LIMIT 1
  `);
  if (row) {
    facts.push(`The letter ${row.letter} has the most names starting with it (${row.cnt}).`);
  }

  row = await one(`
    SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
    FROM typhoonnames WHERE position <= 140
    GROUP BY letter ORDER BY cnt ASC LIMIT 1
  `);
  if (row) {
    facts.push(`The letter ${row.letter} has the fewest names starting with it (${row.cnt}).`);
  }

  return facts;
}

export async function getRandomFact(): Promise<{ data: string | null }> {
  const facts = await generateFacts();
  if (facts.length === 0) {
    return { data: null };
  }
  return { data: facts[Math.floor(Math.random() * facts.length)] };
}
