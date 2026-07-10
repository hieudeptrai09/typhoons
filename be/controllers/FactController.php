<?php
class FactController
{
    private $conn;
    private $monthNames = [
        1 => 'January',
        2 => 'February',
        3 => 'March',
        4 => 'April',
        5 => 'May',
        6 => 'June',
        7 => 'July',
        8 => 'August',
        9 => 'September',
        10 => 'October',
        11 => 'November',
        12 => 'December'
    ];

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getRandomFact()
    {
        $facts = $this->generateFacts();
        if (empty($facts)) {
            return ['data' => null];
        }
        return ['data' => $facts[array_rand($facts)]];
    }

    private function joinNames($items, $joiner = 'and')
    {
        $items = array_values($items);
        if (count($items) === 0) return '';
        if (count($items) === 1) return $items[0];
        if (count($items) === 2) return $items[0] . " $joiner " . $items[1];
        $last = array_pop($items);
        return implode(', ', $items) . " $joiner " . $last;
    }

    private function generateFacts()
    {
        $facts = [];

        // --- Cross-basin facts ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 141");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names given in Hawaiian by CPHC and crossed into the West Pacific basin.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 141 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names given in Hawaiian by CPHC and crossed into the West Pacific basin.";
        }

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 142");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names assigned by NHC that cross 3 Pacific basins.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names assigned by NHC that cross 3 Pacific basins.";
        }

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994)");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "Besides Li (1994), there are $cnt names that cross 3 Pacific basins.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994) ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = "Besides Li (1994), " . $this->joinNames($names) . " are the names that cross 3 Pacific basins.";
        }

        $stmt = $this->conn->query("SELECT name, COUNT(*) as cnt FROM storms WHERE position = 142 GROUP BY name HAVING cnt >= 2");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only name" : "are the only names";
            $facts[] = $this->joinNames($names) . " $label that were given to 2 storms crossing 3 Pacific basins.";
        }

        // --- Category 5 from external basins ---

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 AND intensity = '5'");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only storm from NHC to reach category 5" : "are the storms from NHC that reached category 5";
            $facts[] = $this->joinNames($names) . " $label.";
        }

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 141 AND intensity = '5'");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the storm named in Hawaiian to reach category 5" : "are the storms named in Hawaiian that reached category 5";
            $facts[] = $this->joinNames($names) . " $label.";
        }

        // --- Indian Ocean to Pacific ---

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 143");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($names) . " $label that crossed from the Indian Ocean to the Pacific Ocean.";
        }

        // --- Weak storms retired for destructive reason ---

        $stmt = $this->conn->query("
            SELECT DISTINCT t.name, s.intensity FROM typhoonnames t
            INNER JOIN storms s ON t.name = s.name AND t.position = s.position AND s.year = t.lastYear
            WHERE t.isRetired = 1 AND t.isLanguageProblem = 0 AND t.position <= 140
            AND s.year >= 2000
            AND s.intensity IN ('TD', 'TS', 'STS')
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        $intensityLabels = ['TD' => 'a tropical depression', 'TS' => 'a tropical storm', 'STS' => 'a severe tropical storm'];
        foreach ($rows as $row) {
            $label = $intensityLabels[$row['intensity']] ?? 'a tropical storm';
            $facts[] = "Although {$row['name']} was only $label, it was retired due to the destruction it caused.";
        }

        // --- Strongest storms records ---

        $stmt = $this->conn->query("SELECT name, COUNT(*) as cnt FROM storms WHERE isStrongest = 1 AND year >= 2000 GROUP BY name HAVING cnt > 1");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only name" : "are the only names";
            $facts[] = $this->joinNames($names) . " $label with more than one record-strength storm.";
        }

        // --- Strongest storms not Cat 5 ---

        $stmt = $this->conn->query("SELECT name, year, intensity FROM storms WHERE isStrongest = 1 AND intensity != '5' AND year >= 2000 ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only record-strength storm" : "are the only record-strength storms";
            $facts[] = $this->joinNames($items) . " $label that did not reach category 5.";
        }

        // --- First storms that are Cat 5 ---

        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE isFirst = 1 AND intensity = '5' AND year >= 2000 ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only season-opening storm" : "are the only season-opening storms";
            $facts[] = $this->joinNames($items) . " $label to reach category 5.";
        }

        // --- Storms spanning multiple years ---

        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE monthStart IS NOT NULL AND monthEnd IS NOT NULL AND monthEnd < monthStart AND year >= 2000 ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($items) . " $label that span multiple years.";
        }

        // --- Seasons ending with Cat 5 ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE isLast = 1 AND intensity = '5' AND year >= 2000");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "There are $cnt seasons that ended with a category 5 storm.";
        }
        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE isLast = 1 AND intensity = '5' AND year >= 2000 ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $facts[] = $this->joinNames($items) . " are the season-closing storms that reached category 5.";
        }

        // --- Strongest storms in off-season months (per month) ---

        foreach ([1, 2, 3, 4, 12] as $month) {
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE isStrongest = 1 AND monthStart = :month AND year >= 2000 ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only record-strength storm" : "are the only record-strength storms";
                $facts[] = $this->joinNames($items) . " $label to form in $monthName.";
            }
        }

        // --- First storms in late months (per month) ---

        foreach ([6, 7, 8] as $month) {
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE isFirst = 1 AND monthStart = :month AND year >= 2000 ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only season-opening storm" : "are the only season-opening storms";
                $facts[] = $this->joinNames($items) . " $label to form in $monthName.";
            }
        }

        // --- Cat 5 in off-season months (per month) ---

        foreach ([1, 2, 3, 4, 12] as $month) {
            $stmt = $this->conn->prepare("SELECT COUNT(*) as cnt FROM storms WHERE intensity = '5' AND monthStart = :month AND year >= 2000");
            $stmt->execute([':month' => $month]);
            $cnt = (int)$stmt->fetch()['cnt'];
            if ($cnt > 0) {
                $monthName = $this->monthNames[$month];
                $label = $cnt === 1 ? "is" : "are";
                $facts[] = "There $label $cnt category 5 storm" . ($cnt > 1 ? "s" : "") . " that formed in $monthName.";
            }
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE intensity = '5' AND monthStart = :month AND year >= 2000 ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only category 5 storm" : "are the category 5 storms";
                $facts[] = $this->joinNames($items) . " $label to form in $monthName.";
            }
        }

        // --- Names never reaching typhoon intensity ---

        $stmt = $this->conn->query("
            SELECT COUNT(*) as cnt FROM typhoonnames t
            WHERE t.position <= 140 AND t.isRetired = 0
            AND NOT EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
                AND s.year >= 2000 AND s.intensity IN ('1','2','3','4','5')
            )
            AND EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position AND s.year >= 2000
            )
        ");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "There are $cnt storm names that never reached typhoon intensity.";
        }
        $stmt = $this->conn->query("
            SELECT t.name FROM typhoonnames t
            WHERE t.position <= 140 AND t.isRetired = 0
            AND NOT EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
                AND s.year >= 2000 AND s.intensity IN ('1','2','3','4','5')
            )
            AND EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position AND s.year >= 2000
            )
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $facts[] = "{$row['name']} is a storm name that never reached typhoon intensity.";
        }

        // --- Names where ALL appearances are Cat 5 (times >= 2) ---

        $stmt = $this->conn->query("
            SELECT name, COUNT(*) as total
            FROM storms WHERE position <= 140 AND year >= 2000
            GROUP BY name, position
            HAVING total >= 2 AND total = SUM(CASE WHEN intensity = '5' THEN 1 ELSE 0 END)
        ");
        $rows = $stmt->fetchAll();
        $byCount = [];
        foreach ($rows as $row) {
            $byCount[(int)$row['total']][] = $row['name'];
        }
        foreach ($byCount as $times => $names) {
            $label = count($names) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($names) . " $label that appeared $times times, each time as a category 5 storm.";
        }

        // --- Names where ALL appearances are Cat 4 (times >= 2) ---

        $stmt = $this->conn->query("
            SELECT name, COUNT(*) as total
            FROM storms WHERE position <= 140 AND year >= 2000
            GROUP BY name, position
            HAVING total >= 2 AND total = SUM(CASE WHEN intensity = '4' THEN 1 ELSE 0 END)
        ");
        $rows = $stmt->fetchAll();
        $byCount = [];
        foreach ($rows as $row) {
            $byCount[(int)$row['total']][] = $row['name'];
        }
        foreach ($byCount as $times => $names) {
            $label = count($names) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($names) . " $label that appeared $times times, each time as a category 4 storm.";
        }

        // --- Total names and countries in WPAC ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM typhoonnames WHERE position <= 140");
        $total = (int)$stmt->fetch()['cnt'];
        $stmt = $this->conn->query("SELECT COUNT(DISTINCT p.country) as cnt FROM typhoonnames t INNER JOIN positions p ON t.position = p.id WHERE t.position <= 140");
        $countries = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $total storm names contributed by $countries countries in the western Pacific basin since 2000.";

        // --- Max used non-retired names ---

        $stmt = $this->conn->query("
            SELECT MAX(storm_count) as max_count FROM (
                SELECT COUNT(s.id) as storm_count FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140 AND s.year >= 2000
                GROUP BY t.name, t.position
            ) as sub
        ");
        $maxCount = (int)$stmt->fetch()['max_count'];
        if ($maxCount > 0) {
            $stmt = $this->conn->prepare("
                SELECT COUNT(*) as cnt FROM (
                    SELECT t.name FROM typhoonnames t
                    INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                    WHERE t.isRetired = 0 AND t.position <= 140 AND s.year >= 2000
                    GROUP BY t.name, t.position HAVING COUNT(s.id) = :maxCount
                ) as sub
            ");
            $stmt->execute([':maxCount' => $maxCount]);
            $namesWithMax = (int)$stmt->fetch()['cnt'];
            $facts[] = "$namesWithMax names have been used $maxCount times since 2000 without being retired.";

            $stmt = $this->conn->prepare("
                SELECT t.name FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140 AND s.year >= 2000
                GROUP BY t.name, t.position HAVING COUNT(s.id) = :maxCount
                ORDER BY t.name
            ");
            $stmt->execute([':maxCount' => $maxCount]);
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $facts[] = "{$row['name']} is a name that has been used $maxCount times since 2000 without being retired.";
            }
        }

        // --- Country contributions ---

        $stmt = $this->conn->query("
            SELECT p.country, COUNT(*) as cnt FROM typhoonnames t
            INNER JOIN positions p ON t.position = p.id
            WHERE t.position <= 140 GROUP BY p.country ORDER BY cnt DESC LIMIT 1
        ");
        $row = $stmt->fetch();
        $facts[] = "{$row['country']} has contributed the most names ({$row['cnt']}).";

        $stmt = $this->conn->query("
            SELECT MIN(cnt) as min_cnt FROM (
                SELECT COUNT(*) as cnt FROM typhoonnames t
                INNER JOIN positions p ON t.position = p.id
                WHERE t.position <= 140 GROUP BY p.country
            ) as sub
        ");
        $minCnt = (int)$stmt->fetch()['min_cnt'];
        $stmt = $this->conn->prepare("
            SELECT p.country FROM typhoonnames t
            INNER JOIN positions p ON t.position = p.id
            WHERE t.position <= 140 GROUP BY p.country HAVING COUNT(*) = :cnt ORDER BY p.country
        ");
        $stmt->execute([':cnt' => $minCnt]);
        $leastCountries = array_column($stmt->fetchAll(), 'country');
        $facts[] = $this->joinNames($leastCountries) . " contributed the fewest names ($minCnt).";

        // --- Year records ---

        $stmt = $this->conn->query("SELECT year, COUNT(*) as cnt FROM storms WHERE year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1");
        $row = $stmt->fetch();
        $facts[] = "{$row['year']} had the most storms of any season, with {$row['cnt']}.";

        $stmt = $this->conn->query("
            SELECT MIN(cnt) as min_cnt FROM (
                SELECT COUNT(*) as cnt FROM storms WHERE year >= 2000 GROUP BY year
            ) as sub
        ");
        $minCnt = (int)$stmt->fetch()['min_cnt'];
        $stmt = $this->conn->prepare("SELECT year FROM storms WHERE year >= 2000 GROUP BY year HAVING COUNT(*) = :cnt ORDER BY year");
        $stmt->execute([':cnt' => $minCnt]);
        $years = array_column($stmt->fetchAll(), 'year');
        $label = count($years) === 1 ? "The year" : "The years";
        $verb = count($years) === 1 ? "is" : "are";
        $facts[] = "$label with the fewest storms ($minCnt) $verb " . $this->joinNames($years) . ".";

        $stmt = $this->conn->query("SELECT year, COUNT(*) as cnt FROM storms WHERE intensity = '5' AND year >= 2000 GROUP BY year ORDER BY cnt DESC LIMIT 1");
        $row = $stmt->fetch();
        if ($row) {
            $facts[] = "{$row['year']} had the most category 5 storms of any season.";
        }

        // --- 6-year cycling names ---

        $stmt = $this->conn->query("
            SELECT COUNT(*) as cnt FROM (
                SELECT t.name FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140 AND s.year >= 2000
                GROUP BY t.name, t.position
                HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
            ) as sub
        ");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "$cnt names come back on the list exactly every 6 years without being retired.";
        }
        $stmt = $this->conn->query("
            SELECT t.name FROM typhoonnames t
            INNER JOIN storms s ON t.name = s.name AND t.position = s.position
            WHERE t.isRetired = 0 AND t.position <= 140 AND s.year >= 2000
            GROUP BY t.name, t.position
            HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $facts[] = "{$row['name']} is a name that comes back on the list exactly every 6 years without being retired.";
        }

        // --- Tag records ---

        $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt DESC LIMIT 1");
        $row = $stmt->fetch();
        if ($row) {
            $facts[] = "{$row['tag']} is the category with the most names ({$row['cnt']}).";
        }

        $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt ASC LIMIT 1");
        $row = $stmt->fetch();
        if ($row) {
            $facts[] = "{$row['tag']} is the category with the fewest names ({$row['cnt']}).";
        }

        // --- Rare languages ---

        $stmt = $this->conn->query("SELECT language, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY language HAVING cnt <= 3 ORDER BY cnt");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt === 1) {
                $facts[] = "There is only 1 name from the {$row['language']} language.";
            } else {
                $facts[] = "There are only $cnt names from the {$row['language']} language.";
            }
            $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND language = :lang ORDER BY name");
            $stmt2->execute([':lang' => $row['language']]);
            $names = array_column($stmt2->fetchAll(), 'name');
            if (!empty($names)) {
                $nl = count($names) === 1 ? "is the only name" : "are the only names";
                $facts[] = $this->joinNames($names) . " $nl from the {$row['language']} language.";
            }
        }

        // --- Names per tag ---

        $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 GROUP BY tag ORDER BY cnt");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt <= 3 && $cnt > 0) {
                $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND tag = :tag ORDER BY name");
                $stmt2->execute([':tag' => $row['tag']]);
                $names = array_column($stmt2->fetchAll(), 'name');
                if (!empty($names)) {
                    $nl = count($names) === 1 ? "is the only name" : "are the only names";
                    $facts[] = $this->joinNames($names) . " $nl in the category {$row['tag']}.";
                }
            }
        }

        // --- Language-tag rare combinations ---

        $stmt = $this->conn->query("
            SELECT language, tag, COUNT(*) as cnt FROM typhoonnames
            WHERE position <= 140 GROUP BY language, tag HAVING cnt <= 3 ORDER BY cnt, tag
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt === 1) {
                $facts[] = "There is only 1 name from the {$row['language']} language in the category {$row['tag']}.";
            } else {
                $facts[] = "There are only $cnt names from the {$row['language']} language in the category {$row['tag']}.";
            }
            $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND language = :lang AND tag = :tag ORDER BY name");
            $stmt2->execute([':lang' => $row['language'], ':tag' => $row['tag']]);
            $names = array_column($stmt2->fetchAll(), 'name');
            if (!empty($names)) {
                $nl = count($names) === 1 ? "is the only name" : "are the only names";
                $facts[] = $this->joinNames($names) . " $nl from the {$row['language']} language in the category {$row['tag']}.";
            }
        }

        // --- Country-tag rare combinations ---

        $stmt = $this->conn->query("
            SELECT p.country, t.tag, COUNT(*) as cnt FROM typhoonnames t
            INNER JOIN positions p ON t.position = p.id
            WHERE t.position <= 140 GROUP BY p.country, t.tag HAVING cnt <= 3 ORDER BY cnt, t.tag
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt === 1) {
                $facts[] = "There is only 1 name contributed by {$row['country']} in the category {$row['tag']}.";
            } else {
                $facts[] = "There are only $cnt names contributed by {$row['country']} in the category {$row['tag']}.";
            }
            $stmt2 = $this->conn->prepare("
                SELECT t.name FROM typhoonnames t
                INNER JOIN positions p ON t.position = p.id
                WHERE t.position <= 140 AND p.country = :country AND t.tag = :tag ORDER BY t.name
            ");
            $stmt2->execute([':country' => $row['country'], ':tag' => $row['tag']]);
            $names = array_column($stmt2->fetchAll(), 'name');
            if (!empty($names)) {
                $nl = count($names) === 1 ? "is the only name" : "are the only names";
                $facts[] = $this->joinNames($names) . " $nl contributed by {$row['country']} in the category {$row['tag']}.";
            }
        }

        // --- Language reason retirements ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM typhoonnames WHERE isLanguageProblem = 1 AND isRetired = 1");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names retired for language-related reasons.";
        $stmt = $this->conn->query("SELECT name FROM typhoonnames WHERE isLanguageProblem = 1 AND isRetired = 1 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names retired for language-related reasons.";
        }

        // --- Nearest equator ---

        $stmt = $this->conn->query("SELECT name FROM typhoonnames WHERE isLanguageProblem = 3");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the storm" : "are the storms";
            $facts[] = $this->joinNames($names) . " $label that formed closest to the equator on record.";
        }

        // --- Retirement reasons with notes ---

        $stmt = $this->conn->query("
            SELECT name, note FROM typhoonnames
            WHERE isLanguageProblem = 1 AND isRetired = 1 AND note IS NOT NULL AND note != ''
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $reason = $row['note'];
            if (preg_match('/^(has |was |is )/', $reason)) {
                $facts[] = "The name {$row['name']} was retired because it $reason.";
            } elseif (preg_match('/^resubmitted /', $reason)) {
                $facts[] = "The name {$row['name']} was retired because it was $reason.";
            } else {
                $facts[] = "The name {$row['name']} was retired due to its meaning: $reason.";
            }
        }

        // --- Missing letters ---

        $stmt = $this->conn->query("SELECT DISTINCT UPPER(LEFT(name, 1)) as letter FROM typhoonnames WHERE position <= 140");
        $existing = array_column($stmt->fetchAll(), 'letter');
        $missing = array_diff(range('A', 'Z'), $existing);
        if (!empty($missing)) {
            $facts[] = "No names start with the letter " . $this->joinNames(array_values($missing)) . ".";
        }

        // --- Letters with only active or only retired names ---

        $stmt = $this->conn->query("
            SELECT UPPER(LEFT(name, 1)) as letter,
                   SUM(CASE WHEN isRetired = 0 THEN 1 ELSE 0 END) as active_cnt,
                   SUM(CASE WHEN isRetired = 1 THEN 1 ELSE 0 END) as retired_cnt
            FROM typhoonnames WHERE position <= 140
            GROUP BY letter
        ");
        $rows = $stmt->fetchAll();
        $onlyActive = [];
        $onlyRetired = [];
        foreach ($rows as $row) {
            if ((int)$row['active_cnt'] > 0 && (int)$row['retired_cnt'] === 0) {
                $onlyActive[] = $row['letter'];
            } elseif ((int)$row['retired_cnt'] > 0 && (int)$row['active_cnt'] === 0) {
                $onlyRetired[] = $row['letter'];
            }
        }
        sort($onlyActive);
        sort($onlyRetired);
        if (!empty($onlyActive)) {
            $label = count($onlyActive) === 1 ? "letter" : "letters";
            $verb = count($onlyActive) === 1 ? "has" : "have";
            $facts[] = "The $label " . $this->joinNames($onlyActive) . " $verb only active names (no retired names).";
        }
        if (!empty($onlyRetired)) {
            $label = count($onlyRetired) === 1 ? "letter" : "letters";
            $verb = count($onlyRetired) === 1 ? "has" : "have";
            $facts[] = "The $label " . $this->joinNames($onlyRetired) . " $verb only retired names (no active names).";
        }

        // --- Rare starting letters ---

        $stmt = $this->conn->query("
            SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
            FROM typhoonnames WHERE position <= 140
            GROUP BY letter HAVING cnt <= 3 ORDER BY cnt, letter
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt === 1) {
                $facts[] = "There is only 1 name starting with the letter {$row['letter']}.";
            } else {
                $facts[] = "There are only $cnt names starting with the letter {$row['letter']}.";
            }
            $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND UPPER(LEFT(name, 1)) = :letter ORDER BY name");
            $stmt2->execute([':letter' => $row['letter']]);
            $names = array_column($stmt2->fetchAll(), 'name');
            if (!empty($names)) {
                $nl = count($names) === 1 ? "is the only name" : "are the only names";
                $facts[] = $this->joinNames($names) . " $nl starting with the letter {$row['letter']}.";
            }
        }

        return $facts;
    }
}
