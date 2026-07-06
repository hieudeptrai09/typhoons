import sql from "@/lib/db";

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

function joinNames(items: (string | number)[], joiner = "and"): string {
  const arr = items.map(String);
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} ${joiner} ${arr[1]}`;
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, -1);
  return `${rest.join(", ")} ${joiner} ${last}`;
}

async function rows(query: string, params: unknown[] = []): Promise<Row[]> {
  return (await sql.query(query, params)) as Row[];
}

async function one(query: string, params: unknown[] = []): Promise<Row | undefined> {
  return (await rows(query, params))[0];
}

async function generateFacts(): Promise<string[]> {
  const facts: string[] = [];

  // --- Cross-basin facts ---

  let row = await one("SELECT COUNT(*) as cnt FROM storms WHERE position = 141");
  let cnt = Number(row?.cnt ?? 0);
  facts.push(
    `There are ${cnt} names given in Hawaiian by CPHC and crossed into the West Pacific basin.`,
  );
  let names = (await rows("SELECT DISTINCT name FROM storms WHERE position = 141 ORDER BY name")).map(
    (r) => String(r.name),
  );
  if (names.length > 0) {
    facts.push(
      `${joinNames(names)} are the names given in Hawaiian by CPHC and crossed into the West Pacific basin.`,
    );
  }

  row = await one("SELECT COUNT(*) as cnt FROM storms WHERE position = 142");
  cnt = Number(row?.cnt ?? 0);
  facts.push(`There are ${cnt} names assigned by NHC that cross 3 Pacific basins.`);
  names = (await rows("SELECT DISTINCT name FROM storms WHERE position = 142 ORDER BY name")).map((r) =>
    String(r.name),
  );
  if (names.length > 0) {
    facts.push(`${joinNames(names)} are the names assigned by NHC that cross 3 Pacific basins.`);
  }

  row = await one(
    "SELECT COUNT(*) as cnt FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994)",
  );
  cnt = Number(row?.cnt ?? 0);
  facts.push(`Besides Li (1994), there are ${cnt} names that cross 3 Pacific basins.`);
  names = (
    await rows(
      "SELECT DISTINCT name FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994) ORDER BY name",
    )
  ).map((r) => String(r.name));
  if (names.length > 0) {
    facts.push(`Besides Li (1994), ${joinNames(names)} are the names that cross 3 Pacific basins.`);
  }

  let rowsResult = await rows(
    "SELECT name, COUNT(*) as cnt FROM storms WHERE position = 142 GROUP BY name HAVING COUNT(*) >= 2",
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the only name" : "are the only names";
    facts.push(
      `${joinNames(names)} ${label} that were given to 2 storms crossing 3 Pacific basins.`,
    );
  }

  // --- Category 5 from external basins ---

  rowsResult = await rows("SELECT DISTINCT name FROM storms WHERE position = 142 AND intensity = '5'");
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label =
      names.length === 1
        ? "is the only storm from NHC to reach category 5"
        : "are the storms from NHC that reached category 5";
    facts.push(`${joinNames(names)} ${label}.`);
  }

  rowsResult = await rows("SELECT DISTINCT name FROM storms WHERE position = 141 AND intensity = '5'");
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
    facts.push(`${joinNames(names)} ${label} that crossed from the Indian Ocean to the Pacific Ocean.`);
  }

  // --- Weak storms retired for destructive reason ---

  rowsResult = await rows(`
    SELECT DISTINCT t.name, s.intensity FROM typhoonnames t
    INNER JOIN storms s ON t.name = s.name AND t.position = s.position AND s.year = t."lastYear"
    WHERE t."isRetired" = 1 AND t."isLanguageProblem" = 0 AND t.position <= 140
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
    facts.push(`Although ${r.name} was only ${label}, it was retired due to the destruction it caused.`);
  }

  // --- Strongest storms records ---

  rowsResult = await rows(
    `SELECT name, COUNT(*) as cnt FROM storms WHERE "isStrongest" = 1 AND year >= 2000 GROUP BY name HAVING COUNT(*) > 1`,
  );
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the only name" : "are the only names";
    facts.push(`${joinNames(names)} ${label} with more than one record-strength storm.`);
  }

  // --- Strongest storms not Cat 5 ---

  rowsResult = await rows(
    `SELECT name, year, intensity FROM storms WHERE "isStrongest" = 1 AND intensity != '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label = items.length === 1 ? "is the only record-strength storm" : "are the only record-strength storms";
    facts.push(`${joinNames(items)} ${label} that did not reach category 5.`);
  }

  // --- First storms that are Cat 5 ---

  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE "isFirst" = 1 AND intensity = '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label = items.length === 1 ? "is the only season-opening storm" : "are the only season-opening storms";
    facts.push(`${joinNames(items)} ${label} to reach category 5.`);
  }

  // --- Storms spanning multiple years ---

  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE "monthStart" IS NOT NULL AND "monthEnd" IS NOT NULL AND "monthEnd" < "monthStart" AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    const label = items.length === 1 ? "is the only storm" : "are the only storms";
    facts.push(`${joinNames(items)} ${label} that span multiple years.`);
  }

  // --- Seasons ending with Cat 5 ---

  row = await one(`SELECT COUNT(*) as cnt FROM storms WHERE "isLast" = 1 AND intensity = '5' AND year >= 2000`);
  cnt = Number(row?.cnt ?? 0);
  if (cnt > 0) {
    facts.push(`There are ${cnt} seasons that ended with a category 5 storm.`);
  }
  rowsResult = await rows(
    `SELECT name, year FROM storms WHERE "isLast" = 1 AND intensity = '5' AND year >= 2000 ORDER BY year`,
  );
  if (rowsResult.length > 0) {
    const items = rowsResult.map((r) => `${r.name} (${r.year})`);
    facts.push(`${joinNames(items)} are the season-closing storms that reached category 5.`);
  }

  // --- Strongest storms in off-season months (per month) ---

  for (const month of [1, 2, 3, 4, 12]) {
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE "isStrongest" = 1 AND "monthStart" = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      const label =
        items.length === 1 ? "is the only record-strength storm" : "are the only record-strength storms";
      facts.push(`${joinNames(items)} ${label} to form in ${monthName}.`);
    }
  }

  // --- First storms in late months (per month) ---

  for (const month of [6, 7, 8]) {
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE "isFirst" = 1 AND "monthStart" = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      const label =
        items.length === 1 ? "is the only season-opening storm" : "are the only season-opening storms";
      facts.push(`${joinNames(items)} ${label} to form in ${monthName}.`);
    }
  }

  // --- Cat 5 in off-season months (per month) ---

  for (const month of [1, 2, 3, 4, 12]) {
    row = await one(
      `SELECT COUNT(*) as cnt FROM storms WHERE intensity = '5' AND "monthStart" = $1 AND year >= 2000`,
      [month],
    );
    cnt = Number(row?.cnt ?? 0);
    if (cnt > 0) {
      const monthName = MONTH_NAMES[month];
      const label = cnt === 1 ? "is" : "are";
      facts.push(`There ${label} ${cnt} category 5 storm${cnt > 1 ? "s" : ""} that formed in ${monthName}.`);
    }
    rowsResult = await rows(
      `SELECT name, year FROM storms WHERE intensity = '5' AND "monthStart" = $1 AND year >= 2000 ORDER BY year`,
      [month],
    );
    if (rowsResult.length > 0) {
      const items = rowsResult.map((r) => `${r.name} (${r.year})`);
      const monthName = MONTH_NAMES[month];
      const label = items.length === 1 ? "is the only category 5 storm" : "are the category 5 storms";
      facts.push(`${joinNames(items)} ${label} to form in ${monthName}.`);
    }
  }

  // --- Names never reaching typhoon intensity ---

  row = await one(`
    SELECT COUNT(*) as cnt FROM typhoonnames t
    WHERE t.position <= 140 AND t."isRetired" = 0
    AND NOT EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
        AND s.year >= 2000 AND s.intensity IN ('1','2','3','4','5')
    )
    AND EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position AND s.year >= 2000
    )
  `);
  cnt = Number(row?.cnt ?? 0);
  if (cnt > 0) {
    facts.push(`There are ${cnt} storm names that never reached typhoon intensity.`);
  }
  rowsResult = await rows(`
    SELECT t.name FROM typhoonnames t
    WHERE t.position <= 140 AND t."isRetired" = 0
    AND NOT EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
        AND s.year >= 2000 AND s.intensity IN ('1','2','3','4','5')
    )
    AND EXISTS (
        SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position AND s.year >= 2000
    )
    ORDER BY t.name
  `);
  for (const r of rowsResult) {
    facts.push(`${r.name} is a storm name that never reached typhoon intensity.`);
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

  row = await one("SELECT COUNT(*) as cnt FROM typhoonnames WHERE position <= 140");
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
        WHERE t."isRetired" = 0 AND t.position <= 140 AND s.year >= 2000
        GROUP BY t.name, t.position
    ) as sub
  `);
  const maxCount = Number(row?.max_count ?? 0);
  if (maxCount > 0) {
    row = await one(
      `
      SELECT COUNT(*) as cnt FROM (
          SELECT t.name FROM typhoonnames t
          INNER JOIN storms s ON t.name = s.name AND t.position = s.position
          WHERE t."isRetired" = 0 AND t.position <= 140 AND s.year >= 2000
          GROUP BY t.name, t.position HAVING COUNT(s.id) = $1
      ) as sub
      `,
      [maxCount],
    );
    const namesWithMax = Number(row?.cnt ?? 0);
    facts.push(`${namesWithMax} names have been used ${maxCount} times since 2000 without being retired.`);

    rowsResult = await rows(
      `
      SELECT t.name FROM typhoonnames t
      INNER JOIN storms s ON t.name = s.name AND t.position = s.position
      WHERE t."isRetired" = 0 AND t.position <= 140 AND s.year >= 2000
      GROUP BY t.name, t.position HAVING COUNT(s.id) = $1
      ORDER BY t.name
      `,
      [maxCount],
    );
    for (const r of rowsResult) {
      facts.push(`${r.name} is a name that has been used ${maxCount} times since 2000 without being retired.`);
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

  row = await one("SELECT year, COUNT(*) as cnt FROM storms WHERE year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1");
  if (row) {
    facts.push(`${row.year} had the most storms of any season, with ${row.cnt}.`);
  }

  row = await one(`
    SELECT MIN(cnt) as min_cnt FROM (
        SELECT COUNT(*) as cnt FROM storms WHERE year >= 2000 GROUP BY year
    ) as sub
  `);
  const minYearCnt = Number(row?.min_cnt ?? 0);
  rowsResult = await rows(
    "SELECT year FROM storms WHERE year >= 2000 GROUP BY year HAVING COUNT(*) = $1 ORDER BY year",
    [minYearCnt],
  );
  const years = rowsResult.map((r) => Number(r.year));
  {
    const label = years.length === 1 ? "The year" : "The years";
    const verb = years.length === 1 ? "is" : "are";
    facts.push(`${label} with the fewest storms (${minYearCnt}) ${verb} ${joinNames(years)}.`);
  }

  row = await one(
    "SELECT year, COUNT(*) as cnt FROM storms WHERE intensity = '5' AND year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1",
  );
  if (row) {
    facts.push(`${row.year} had the most category 5 storms of any season.`);
  }

  // --- 6-year cycling names ---

  row = await one(`
    SELECT COUNT(*) as cnt FROM (
        SELECT t.name FROM typhoonnames t
        INNER JOIN storms s ON t.name = s.name AND t.position = s.position
        WHERE t."isRetired" = 0 AND t.position <= 140 AND s.year >= 2000
        GROUP BY t.name, t.position
        HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
    ) as sub
  `);
  cnt = Number(row?.cnt ?? 0);
  if (cnt > 0) {
    facts.push(`${cnt} names come back on the list exactly every 6 years without being retired.`);
  }
  rowsResult = await rows(`
    SELECT t.name FROM typhoonnames t
    INNER JOIN storms s ON t.name = s.name AND t.position = s.position
    WHERE t."isRetired" = 0 AND t.position <= 140 AND s.year >= 2000
    GROUP BY t.name, t.position
    HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
    ORDER BY t.name
  `);
  for (const r of rowsResult) {
    facts.push(`${r.name} is a name that comes back on the list exactly every 6 years without being retired.`);
  }

  // --- Tag records ---

  row = await one("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt DESC LIMIT 1");
  if (row) {
    facts.push(`${row.tag} is the category with the most names (${row.cnt}).`);
  }

  row = await one("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt ASC LIMIT 1");
  if (row) {
    facts.push(`${row.tag} is the category with the fewest names (${row.cnt}).`);
  }

  // --- Rare languages ---

  rowsResult = await rows(
    "SELECT language, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY language HAVING COUNT(*) <= 3 ORDER BY cnt",
  );
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    if (rCnt === 1) {
      facts.push(`There is only 1 name from the ${r.language} language.`);
    } else {
      facts.push(`There are only ${rCnt} names from the ${r.language} language.`);
    }
    const langNames = (
      await rows("SELECT name FROM typhoonnames WHERE position <= 140 AND language = $1 ORDER BY name", [
        r.language,
      ])
    ).map((nr) => String(nr.name));
    if (langNames.length > 0) {
      const nl = langNames.length === 1 ? "is the only name" : "are the only names";
      facts.push(`${joinNames(langNames)} ${nl} from the ${r.language} language.`);
    }
  }

  // --- Names per tag ---

  rowsResult = await rows(
    "SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt",
  );
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    facts.push(`There are ${rCnt} names in the category ${r.tag}.`);
    if (rCnt <= 3 && rCnt > 0) {
      const tagNames = (
        await rows("SELECT name FROM typhoonnames WHERE position <= 140 AND tag = $1 ORDER BY name", [r.tag])
      ).map((nr) => String(nr.name));
      if (tagNames.length > 0) {
        const nl = tagNames.length === 1 ? "is the only name" : "are the only names";
        facts.push(`${joinNames(tagNames)} ${nl} in the category ${r.tag}.`);
      }
    }
  }

  // --- Language-tag rare combinations ---

  rowsResult = await rows(`
    SELECT language, tag, COUNT(*) as cnt FROM typhoonnames
    WHERE position <= 140 GROUP BY language, tag HAVING COUNT(*) <= 3 ORDER BY cnt, tag
  `);
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    if (rCnt === 1) {
      facts.push(`There is only 1 name from the ${r.language} language in the category ${r.tag}.`);
    } else {
      facts.push(`There are only ${rCnt} names from the ${r.language} language in the category ${r.tag}.`);
    }
    const combNames = (
      await rows(
        "SELECT name FROM typhoonnames WHERE position <= 140 AND language = $1 AND tag = $2 ORDER BY name",
        [r.language, r.tag],
      )
    ).map((nr) => String(nr.name));
    if (combNames.length > 0) {
      const nl = combNames.length === 1 ? "is the only name" : "are the only names";
      facts.push(`${joinNames(combNames)} ${nl} from the ${r.language} language in the category ${r.tag}.`);
    }
  }

  // --- Country-tag rare combinations ---

  rowsResult = await rows(`
    SELECT p.country, t.tag, COUNT(*) as cnt FROM typhoonnames t
    INNER JOIN positions p ON t.position = p.id
    WHERE t.position <= 140 GROUP BY p.country, t.tag HAVING COUNT(*) <= 3 ORDER BY cnt, t.tag
  `);
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    if (rCnt === 1) {
      facts.push(`There is only 1 name contributed by ${r.country} in the category ${r.tag}.`);
    } else {
      facts.push(`There are only ${rCnt} names contributed by ${r.country} in the category ${r.tag}.`);
    }
    const countryTagNames = (
      await rows(
        `
        SELECT t.name FROM typhoonnames t
        INNER JOIN positions p ON t.position = p.id
        WHERE t.position <= 140 AND p.country = $1 AND t.tag = $2 ORDER BY t.name
        `,
        [r.country, r.tag],
      )
    ).map((nr) => String(nr.name));
    if (countryTagNames.length > 0) {
      const nl = countryTagNames.length === 1 ? "is the only name" : "are the only names";
      facts.push(`${joinNames(countryTagNames)} ${nl} contributed by ${r.country} in the category ${r.tag}.`);
    }
  }

  // --- Language reason retirements ---

  row = await one(`SELECT COUNT(*) as cnt FROM typhoonnames WHERE "isLanguageProblem" = 1 AND "isRetired" = 1`);
  cnt = Number(row?.cnt ?? 0);
  facts.push(`There are ${cnt} names retired for language-related reasons.`);
  names = (
    await rows(`SELECT name FROM typhoonnames WHERE "isLanguageProblem" = 1 AND "isRetired" = 1 ORDER BY name`)
  ).map((r) => String(r.name));
  if (names.length > 0) {
    facts.push(`${joinNames(names)} are the names retired for language-related reasons.`);
  }

  // --- Nearest equator ---

  rowsResult = await rows(`SELECT name FROM typhoonnames WHERE "isLanguageProblem" = 3`);
  if (rowsResult.length > 0) {
    names = rowsResult.map((r) => String(r.name));
    const label = names.length === 1 ? "is the storm" : "are the storms";
    facts.push(`${joinNames(names)} ${label} that formed closest to the equator on record.`);
  }

  // --- Retirement reasons with notes ---

  rowsResult = await rows(`
    SELECT name, note FROM typhoonnames
    WHERE "isLanguageProblem" = 1 AND "isRetired" = 1 AND note IS NOT NULL AND note != ''
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

  const existing = (
    await rows("SELECT DISTINCT UPPER(LEFT(name, 1)) as letter FROM typhoonnames WHERE position <= 140")
  ).map((r) => String(r.letter));
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const missing = allLetters.filter((l) => !existing.includes(l));
  if (missing.length > 0) {
    facts.push(`No names start with the letter ${joinNames(missing)}.`);
  }

  // --- Letters with only active or only retired names ---

  rowsResult = await rows(`
    SELECT UPPER(LEFT(name, 1)) as letter,
           SUM(CASE WHEN "isRetired" = 0 THEN 1 ELSE 0 END) as active_cnt,
           SUM(CASE WHEN "isRetired" = 1 THEN 1 ELSE 0 END) as retired_cnt
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
    facts.push(`The ${label} ${joinNames(onlyActive)} ${verb} only active names (no retired names).`);
  }
  if (onlyRetired.length > 0) {
    const label = onlyRetired.length === 1 ? "letter" : "letters";
    const verb = onlyRetired.length === 1 ? "has" : "have";
    facts.push(`The ${label} ${joinNames(onlyRetired)} ${verb} only retired names (no active names).`);
  }

  // --- Rare starting letters ---

  rowsResult = await rows(`
    SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
    FROM typhoonnames WHERE position <= 140
    GROUP BY letter HAVING COUNT(*) <= 3 ORDER BY cnt, letter
  `);
  for (const r of rowsResult) {
    const rCnt = Number(r.cnt);
    if (rCnt === 1) {
      facts.push(`There is only 1 name starting with the letter ${r.letter}.`);
    } else {
      facts.push(`There are only ${rCnt} names starting with the letter ${r.letter}.`);
    }
    const letterNames = (
      await rows(
        "SELECT name FROM typhoonnames WHERE position <= 140 AND UPPER(LEFT(name, 1)) = $1 ORDER BY name",
        [r.letter],
      )
    ).map((nr) => String(nr.name));
    if (letterNames.length > 0) {
      const nl = letterNames.length === 1 ? "is the only name" : "are the only names";
      facts.push(`${joinNames(letterNames)} ${nl} starting with the letter ${r.letter}.`);
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
