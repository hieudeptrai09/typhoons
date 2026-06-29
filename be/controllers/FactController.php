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

        $statusFilters = [
            ['sql' => '', 'sqlT' => '', 'label' => ''],
            ['sql' => 'AND isRetired = 0', 'sqlT' => 'AND t.isRetired = 0', 'label' => 'active '],
            ['sql' => 'AND isRetired = 1', 'sqlT' => 'AND t.isRetired = 1', 'label' => 'retired '],
        ];

        // --- Cross-basin facts ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 141");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names that named in Hawaiian by CPHC.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 141 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names that named in Hawaiian by CPHC.";
        }

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 142");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names that named by NHC and come across 3 pacific basins.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names that named by NHC and come across 3 pacific basins.";
        }

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994)");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "Besides Li (1994), there are $cnt names that come across 3 pacific basins.";
        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 AND NOT (name = 'Li' AND year = 1994) ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = "Besides Li (1994), " . $this->joinNames($names) . " are the names that come across 3 pacific basins.";
        }

        $stmt = $this->conn->query("SELECT name, COUNT(*) as cnt FROM storms WHERE position = 142 GROUP BY name HAVING cnt >= 2");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only name" : "are the only names";
            $facts[] = $this->joinNames($names) . " $label that names for 2 storms coming across 3 pacific basins.";
        }

        // --- Category 5 from external basins ---

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 142 AND intensity = '5'");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only storm from NHC that have category 5" : "are the storms from NHC that have category 5";
            $facts[] = $this->joinNames($names) . " $label.";
        }

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 141 AND intensity = '5'");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the storm named in Hawaiian that have category 5" : "are the storms named in Hawaiian that have category 5";
            $facts[] = $this->joinNames($names) . " $label.";
        }

        // --- Indian Ocean to Pacific ---

        $stmt = $this->conn->query("SELECT DISTINCT name FROM storms WHERE position = 143");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($names) . " $label go from Indian Ocean to Pacific Ocean.";
        }

        // --- Weak storms retired for destructive reason ---

        $stmt = $this->conn->query("
            SELECT DISTINCT t.name, s.intensity FROM typhoonnames t
            INNER JOIN storms s ON t.name = s.name AND t.position = s.position AND s.year = t.lastYear
            WHERE t.isRetired = 1 AND t.isLanguageProblem = 0 AND t.position <= 140
            AND s.intensity IN ('TD', 'TS', 'STS')
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        $intensityLabels = ['TD' => 'a tropical depression', 'TS' => 'a tropical storm', 'STS' => 'a severe tropical storm'];
        foreach ($rows as $row) {
            $label = $intensityLabels[$row['intensity']] ?? 'a tropical storm';
            $facts[] = "Although {$row['name']} is $label, {$row['name']} is retired because of destructive reason.";
        }

        // --- Strongest storms records ---

        $stmt = $this->conn->query("SELECT name, COUNT(*) as cnt FROM storms WHERE isStrongest = 1 GROUP BY name HAVING cnt > 1");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the only name" : "are the only names";
            $facts[] = $this->joinNames($names) . " $label that having more than one strongest storms.";
        }

        // --- External names with strongest/first/last (separate queries) ---

        $roleLabels = ['isStrongest' => 'strongest', 'isFirst' => 'first', 'isLast' => 'last'];
        foreach ($roleLabels as $col => $label) {
            $stmt = $this->conn->query("
                SELECT s.name, p.country
                FROM storms s
                INNER JOIN positions p ON s.position = p.id
                WHERE s.position IN (141, 142, 143) AND s.$col = 1
            ");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $facts[] = "{$row['name']} is the only name from {$row['country']} that becomes the $label storm.";
            }
        }

        // --- Strongest storms not Cat 5 ---

        $stmt = $this->conn->query("SELECT name, year, intensity FROM storms WHERE isStrongest = 1 AND intensity != '5' ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only strongest storm" : "are the only strongest storms";
            $facts[] = $this->joinNames($items) . " $label not category 5.";
        }

        // --- First storms that are Cat 5 ---

        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE isFirst = 1 AND intensity = '5' ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only first storm" : "are the only first storms";
            $facts[] = $this->joinNames($items) . " $label that become category 5.";
        }

        // --- Storms spanning multiple years ---

        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE monthStart IS NOT NULL AND monthEnd IS NOT NULL AND monthEnd < monthStart ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $label = count($items) === 1 ? "is the only storm" : "are the only storms";
            $facts[] = $this->joinNames($items) . " $label that span multiple years.";
        }

        // --- Seasons ending with Cat 5 ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM storms WHERE isLast = 1 AND intensity = '5'");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "There are $cnt seasons that end by a category 5 storm.";
        }
        $stmt = $this->conn->query("SELECT name, year FROM storms WHERE isLast = 1 AND intensity = '5' ORDER BY year");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
            $facts[] = $this->joinNames($items) . " are the last storms that are category 5.";
        }

        // --- Strongest storms in off-season months (per month) ---

        foreach ([1, 2, 3, 4, 12] as $month) {
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE isStrongest = 1 AND monthStart = :month ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only strongest storm" : "are the only strongest storms";
                $facts[] = $this->joinNames($items) . " $label formed in the month of $monthName.";
            }
        }

        // --- First storms in late months (per month) ---

        foreach ([6, 7, 8] as $month) {
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE isFirst = 1 AND monthStart = :month ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only first storm" : "are the only first storms";
                $facts[] = $this->joinNames($items) . " $label formed in the month of $monthName.";
            }
        }

        // --- Cat 5 in off-season months (per month) ---

        foreach ([1, 2, 3, 4, 12] as $month) {
            $stmt = $this->conn->prepare("SELECT COUNT(*) as cnt FROM storms WHERE intensity = '5' AND monthStart = :month");
            $stmt->execute([':month' => $month]);
            $cnt = (int)$stmt->fetch()['cnt'];
            if ($cnt > 0) {
                $monthName = $this->monthNames[$month];
                $label = $cnt === 1 ? "is" : "are";
                $facts[] = "There $label $cnt category 5 storm" . ($cnt > 1 ? "s" : "") . " in the month of $monthName.";
            }
            $stmt = $this->conn->prepare("SELECT name, year FROM storms WHERE intensity = '5' AND monthStart = :month ORDER BY year");
            $stmt->execute([':month' => $month]);
            $rows = $stmt->fetchAll();
            if (!empty($rows)) {
                $items = array_map(fn($r) => "{$r['name']} ({$r['year']})", $rows);
                $monthName = $this->monthNames[$month];
                $label = count($items) === 1 ? "is the only category 5 storm" : "are the category 5 storms";
                $facts[] = $this->joinNames($items) . " $label in the month of $monthName.";
            }
        }

        // --- Names never reaching typhoon intensity ---

        $stmt = $this->conn->query("
            SELECT COUNT(*) as cnt FROM typhoonnames t
            WHERE t.position <= 140 AND t.isRetired = 0
            AND NOT EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
                AND s.intensity IN ('1','2','3','4','5')
            )
            AND EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
            )
        ");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "There are $cnt storm names that have no intensity from typhoon status above.";
        }
        $stmt = $this->conn->query("
            SELECT t.name FROM typhoonnames t
            WHERE t.position <= 140 AND t.isRetired = 0
            AND NOT EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
                AND s.intensity IN ('1','2','3','4','5')
            )
            AND EXISTS (
                SELECT 1 FROM storms s WHERE s.name = t.name AND s.position = t.position
            )
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $facts[] = "{$row['name']} is a storm name that have no intensity from typhoon status above.";
        }

        // --- Names where ALL appearances are Cat 5 (times >= 2) ---

        $stmt = $this->conn->query("
            SELECT name, COUNT(*) as total
            FROM storms WHERE position <= 140
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
            $facts[] = $this->joinNames($names) . " $label that appears $times times with each time is a category 5 storm.";
        }

        // --- Names where ALL appearances are Cat 4 (times >= 2) ---

        $stmt = $this->conn->query("
            SELECT name, COUNT(*) as total
            FROM storms WHERE position <= 140
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
            $facts[] = $this->joinNames($names) . " $label that appears $times times with each time is a category 4 storm.";
        }

        // --- Total names and countries in WPAC ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM typhoonnames WHERE position <= 140");
        $total = (int)$stmt->fetch()['cnt'];
        $stmt = $this->conn->query("SELECT COUNT(DISTINCT p.country) as cnt FROM typhoonnames t INNER JOIN positions p ON t.position = p.id WHERE t.position <= 140");
        $countries = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $total storm names contributed by $countries countries in western pacific basin from 2000 to now.";

        // --- Max used non-retired names ---

        $stmt = $this->conn->query("
            SELECT MAX(storm_count) as max_count FROM (
                SELECT COUNT(s.id) as storm_count FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140
                GROUP BY t.name, t.position
            ) as sub
        ");
        $maxCount = (int)$stmt->fetch()['max_count'];
        if ($maxCount > 0) {
            $stmt = $this->conn->prepare("
                SELECT COUNT(*) as cnt FROM (
                    SELECT t.name FROM typhoonnames t
                    INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                    WHERE t.isRetired = 0 AND t.position <= 140
                    GROUP BY t.name, t.position HAVING COUNT(s.id) = :maxCount
                ) as sub
            ");
            $stmt->execute([':maxCount' => $maxCount]);
            $namesWithMax = (int)$stmt->fetch()['cnt'];
            $facts[] = "$namesWithMax names are used $maxCount times from 2000 to now without being retired.";

            $stmt = $this->conn->prepare("
                SELECT t.name FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140
                GROUP BY t.name, t.position HAVING COUNT(s.id) = :maxCount
                ORDER BY t.name
            ");
            $stmt->execute([':maxCount' => $maxCount]);
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $facts[] = "{$row['name']} is a name used $maxCount times from 2000 to now without being retired.";
            }
        }

        // --- Country contributions ---

        $stmt = $this->conn->query("
            SELECT p.country, COUNT(*) as cnt FROM typhoonnames t
            INNER JOIN positions p ON t.position = p.id
            WHERE t.position <= 140 GROUP BY p.country ORDER BY cnt DESC LIMIT 1
        ");
        $row = $stmt->fetch();
        $facts[] = "{$row['country']} contributed the most names with {$row['cnt']}.";

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
        $facts[] = $this->joinNames($leastCountries) . " contributed the least names with $minCnt.";

        // --- Year records ---

        $stmt = $this->conn->query("SELECT year, COUNT(*) as cnt FROM storms GROUP BY year ORDER BY cnt DESC LIMIT 1");
        $row = $stmt->fetch();
        $facts[] = "The year with the most storms is {$row['year']}.";

        $stmt = $this->conn->query("
            SELECT MIN(cnt) as min_cnt FROM (
                SELECT COUNT(*) as cnt FROM storms GROUP BY year
            ) as sub
        ");
        $minCnt = (int)$stmt->fetch()['min_cnt'];
        $stmt = $this->conn->prepare("SELECT year FROM storms GROUP BY year HAVING COUNT(*) = :cnt ORDER BY year");
        $stmt->execute([':cnt' => $minCnt]);
        $years = array_column($stmt->fetchAll(), 'year');
        $label = count($years) === 1 ? "The year" : "The years";
        $verb = count($years) === 1 ? "is" : "are";
        $facts[] = "$label with the least storms $verb " . $this->joinNames($years) . ".";

        $stmt = $this->conn->query("SELECT year, COUNT(*) as cnt FROM storms WHERE intensity = '5' GROUP BY year ORDER BY cnt DESC LIMIT 1");
        $row = $stmt->fetch();
        if ($row) {
            $facts[] = "The year with the most category 5 storms is {$row['year']}.";
        }

        // --- 6-year cycling names ---

        $stmt = $this->conn->query("
            SELECT COUNT(*) as cnt FROM (
                SELECT t.name FROM typhoonnames t
                INNER JOIN storms s ON t.name = s.name AND t.position = s.position
                WHERE t.isRetired = 0 AND t.position <= 140
                GROUP BY t.name, t.position
                HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
            ) as sub
        ");
        $cnt = (int)$stmt->fetch()['cnt'];
        if ($cnt > 0) {
            $facts[] = "$cnt names comeback exactly each 6 years without being retired.";
        }
        $stmt = $this->conn->query("
            SELECT t.name FROM typhoonnames t
            INNER JOIN storms s ON t.name = s.name AND t.position = s.position
            WHERE t.isRetired = 0 AND t.position <= 140
            GROUP BY t.name, t.position
            HAVING COUNT(s.id) >= 4 AND MAX(s.year) - MIN(s.year) = (COUNT(s.id) - 1) * 6
            ORDER BY t.name
        ");
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $facts[] = "{$row['name']} is a name that comeback exactly each 6 years without being retired.";
        }

        // --- Tag records ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 {$sf['sql']} GROUP BY tag ORDER BY cnt DESC LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                $facts[] = "{$row['tag']} is the category that have the most {$sf['label']}names with {$row['cnt']}.";
            }

            $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 {$sf['sql']} GROUP BY tag ORDER BY cnt ASC LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                $facts[] = "{$row['tag']} is the category that have the least {$sf['label']}names with {$row['cnt']}.";
            }
        }

        // --- Rare languages ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("SELECT language, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 {$sf['sql']} GROUP BY language HAVING cnt <= 3 ORDER BY cnt");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $cnt = (int)$row['cnt'];
                if ($cnt === 1) {
                    $facts[] = "There is only 1 {$sf['label']}name that come from {$row['language']} language.";
                } else {
                    $facts[] = "There are only $cnt {$sf['label']}names that come from {$row['language']} language.";
                }
                $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND language = :lang {$sf['sql']} ORDER BY name");
                $stmt2->execute([':lang' => $row['language']]);
                $names = array_column($stmt2->fetchAll(), 'name');
                if (!empty($names)) {
                    $nl = count($names) === 1 ? "is the only {$sf['label']}name" : "are the only {$sf['label']}names";
                    $facts[] = $this->joinNames($names) . " $nl that come from {$row['language']} language.";
                }
            }
        }

        // --- Names per tag ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("SELECT tag, COUNT(*) as cnt FROM typhoonnames WHERE position <= 140 {$sf['sql']} GROUP BY tag ORDER BY cnt");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $cnt = (int)$row['cnt'];
                $facts[] = "There are $cnt {$sf['label']}names come from the category {$row['tag']}.";
                if ($cnt <= 3 && $cnt > 0) {
                    $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND tag = :tag {$sf['sql']} ORDER BY name");
                    $stmt2->execute([':tag' => $row['tag']]);
                    $names = array_column($stmt2->fetchAll(), 'name');
                    if (!empty($names)) {
                        $nl = count($names) === 1 ? "is the only {$sf['label']}name" : "are the only {$sf['label']}names";
                        $facts[] = $this->joinNames($names) . " $nl come from the category {$row['tag']}.";
                    }
                }
            }
        }

        // --- Language-tag rare combinations ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("
                SELECT language, tag, COUNT(*) as cnt FROM typhoonnames
                WHERE position <= 140 {$sf['sql']} GROUP BY language, tag HAVING cnt <= 3 ORDER BY cnt, tag
            ");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $cnt = (int)$row['cnt'];
                if ($cnt === 1) {
                    $facts[] = "There is only 1 {$sf['label']}name that come from {$row['language']} language in the category {$row['tag']}.";
                } else {
                    $facts[] = "There are only $cnt {$sf['label']}names that come from {$row['language']} language in the category {$row['tag']}.";
                }
                $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND language = :lang AND tag = :tag {$sf['sql']} ORDER BY name");
                $stmt2->execute([':lang' => $row['language'], ':tag' => $row['tag']]);
                $names = array_column($stmt2->fetchAll(), 'name');
                if (!empty($names)) {
                    $nl = count($names) === 1 ? "is the only {$sf['label']}name" : "are the only {$sf['label']}names";
                    $facts[] = $this->joinNames($names) . " $nl that come from {$row['language']} language in the category {$row['tag']}.";
                }
            }
        }

        // --- Country-tag rare combinations ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("
                SELECT p.country, t.tag, COUNT(*) as cnt FROM typhoonnames t
                INNER JOIN positions p ON t.position = p.id
                WHERE t.position <= 140 {$sf['sqlT']} GROUP BY p.country, t.tag HAVING cnt <= 3 ORDER BY cnt, t.tag
            ");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $cnt = (int)$row['cnt'];
                if ($cnt === 1) {
                    $facts[] = "There is only 1 {$sf['label']}name that contributed from {$row['country']} in the category {$row['tag']}.";
                } else {
                    $facts[] = "There are only $cnt {$sf['label']}names that contributed from {$row['country']} in the category {$row['tag']}.";
                }
                $stmt2 = $this->conn->prepare("
                    SELECT t.name FROM typhoonnames t
                    INNER JOIN positions p ON t.position = p.id
                    WHERE t.position <= 140 AND p.country = :country AND t.tag = :tag {$sf['sqlT']} ORDER BY t.name
                ");
                $stmt2->execute([':country' => $row['country'], ':tag' => $row['tag']]);
                $names = array_column($stmt2->fetchAll(), 'name');
                if (!empty($names)) {
                    $nl = count($names) === 1 ? "is the only {$sf['label']}name" : "are the only {$sf['label']}names";
                    $facts[] = $this->joinNames($names) . " $nl that contributed from {$row['country']} in the category {$row['tag']}.";
                }
            }
        }

        // --- Language reason retirements ---

        $stmt = $this->conn->query("SELECT COUNT(*) as cnt FROM typhoonnames WHERE isLanguageProblem = 1 AND isRetired = 1");
        $cnt = (int)$stmt->fetch()['cnt'];
        $facts[] = "There are $cnt names retired by language reason.";
        $stmt = $this->conn->query("SELECT name FROM typhoonnames WHERE isLanguageProblem = 1 AND isRetired = 1 ORDER BY name");
        $names = array_column($stmt->fetchAll(), 'name');
        if (!empty($names)) {
            $facts[] = $this->joinNames($names) . " are the names retired by language reason.";
        }

        // --- Nearest equator ---

        $stmt = $this->conn->query("SELECT name FROM typhoonnames WHERE isLanguageProblem = 3");
        $rows = $stmt->fetchAll();
        if (!empty($rows)) {
            $names = array_column($rows, 'name');
            $label = count($names) === 1 ? "is the storm" : "are the storms";
            $facts[] = $this->joinNames($names) . " $label nearest the equator in the history.";
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
                $facts[] = "The name {$row['name']} is retired because it $reason.";
            } elseif (preg_match('/^resubmitted /', $reason)) {
                $facts[] = "The name {$row['name']} is retired because it was $reason.";
            } else {
                $facts[] = "The name {$row['name']} is retired because of its meaning: $reason.";
            }
        }

        // --- Missing letters ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("SELECT DISTINCT UPPER(LEFT(name, 1)) as letter FROM typhoonnames WHERE position <= 140 {$sf['sql']}");
            $existing = array_column($stmt->fetchAll(), 'letter');
            $missing = array_diff(range('A', 'Z'), $existing);
            if (!empty($missing)) {
                $facts[] = "There are not any {$sf['label']}names start with letter " . $this->joinNames(array_values($missing)) . ".";
            }
        }

        // --- Rare starting letters ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("
                SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
                FROM typhoonnames WHERE position <= 140 {$sf['sql']}
                GROUP BY letter HAVING cnt <= 3 ORDER BY cnt, letter
            ");
            $rows = $stmt->fetchAll();
            foreach ($rows as $row) {
                $cnt = (int)$row['cnt'];
                if ($cnt === 1) {
                    $facts[] = "There is only 1 {$sf['label']}name start with letter {$row['letter']}.";
                } else {
                    $facts[] = "There are only $cnt {$sf['label']}names start with letter {$row['letter']}.";
                }
                $stmt2 = $this->conn->prepare("SELECT name FROM typhoonnames WHERE position <= 140 AND UPPER(LEFT(name, 1)) = :letter {$sf['sql']} ORDER BY name");
                $stmt2->execute([':letter' => $row['letter']]);
                $names = array_column($stmt2->fetchAll(), 'name');
                if (!empty($names)) {
                    $nl = count($names) === 1 ? "is the only {$sf['label']}name" : "are the only {$sf['label']}names";
                    $facts[] = $this->joinNames($names) . " $nl start with letter {$row['letter']}.";
                }
            }
        }

        // --- Most/least common starting letter ---

        foreach ($statusFilters as $sf) {
            $stmt = $this->conn->query("
                SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
                FROM typhoonnames WHERE position <= 140 {$sf['sql']}
                GROUP BY letter ORDER BY cnt DESC LIMIT 1
            ");
            $row = $stmt->fetch();
            if ($row) {
                $facts[] = "The letter {$row['letter']} has the most {$sf['label']}names start with ({$row['cnt']}).";
            }

            $stmt = $this->conn->query("
                SELECT UPPER(LEFT(name, 1)) as letter, COUNT(*) as cnt
                FROM typhoonnames WHERE position <= 140 {$sf['sql']}
                GROUP BY letter ORDER BY cnt ASC LIMIT 1
            ");
            $row = $stmt->fetch();
            if ($row) {
                $facts[] = "The letter {$row['letter']} has the least {$sf['label']}names start with ({$row['cnt']}).";
            }
        }

        return $facts;
    }
}
