<?php
class FactController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getFacts()
    {
        $facts = array_merge(
            $this->getMostUsedNames(),
            $this->getNeverRetiredLongRunners(),
            $this->getMostRetiredCountries(),
            $this->getOnlyRetiredFromLanguage(),
            $this->getStrongestStormFacts(),
            $this->getNameUsedAcrossIntensities(),
            $this->getShortestLivedNames(),
            $this->getMostCat5Names(),
            $this->getSameYearFirstAndLast(),
            $this->getLanguageWithMostActiveNames(),
            $this->getNameRetiredOnFirstUse(),
            $this->getMostReplacedPosition(),
            $this->getYearWithMostRetirements(),
            $this->getRareTags(),
            $this->getAlwaysCat5Names(),
            $this->getNeverAboveTS(),
            $this->getCountriesNeverRetired(),
            $this->getOnlyNameFromLanguage(),
            $this->getOnlyCrossBasinNames(),
            $this->getNameAlwaysStrongest(),
            $this->getOnlyTDNames(),
            $this->getRareRetirementReasons(),
            $this->getOnlyNameFromLanguageInTag(),
            $this->getOnlyNameFromCountryInTag(),
            $this->getOnlyRetiredInTag(),
            $this->getOnlyCat5FromCountry(),
            $this->getCrossBasinFacts(),
            $this->getFirstLetterFacts(),
            $this->getLeastFacts()
        );

        shuffle($facts);

        return [
            'count' => count($facts),
            'data' => $facts
        ];
    }

    public function getRandomFact()
    {
        $result = $this->getFacts();
        $facts = $result['data'];
        $fact = $facts[array_rand($facts)];

        return [
            'data' => $fact
        ];
    }

    private function getMostUsedNames()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as useCount
             FROM storms s
             INNER JOIN typhoonnames tn ON s.name = tn.name
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0
             GROUP BY s.name
             HAVING useCount >= 5
             ORDER BY useCount DESC
             LIMIT 5"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'longevity',
                'text' => $row['name'] . ' has been used ' . $row['useCount'] . ' times and has never been retired.'
            ];
        }
        return $facts;
    }

    private function getNeverRetiredLongRunners()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, MIN(s.year) as firstYear, MAX(s.year) as lastYear, COUNT(*) as useCount
             FROM storms s
             INNER JOIN typhoonnames tn ON s.name = tn.name
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0
             GROUP BY s.name
             HAVING useCount >= 4 AND (MAX(s.year) - MIN(s.year)) >= 20
             ORDER BY (MAX(s.year) - MIN(s.year)) DESC
             LIMIT 3"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $span = $row['lastYear'] - $row['firstYear'];
            $facts[] = [
                'category' => 'longevity',
                'text' => $row['name'] . ' has survived ' . $span . ' years on the naming list (since ' . $row['firstYear'] . '), used ' . $row['useCount'] . ' times without retirement.'
            ];
        }
        return $facts;
    }

    private function getMostRetiredCountries()
    {
        $stmt = $this->conn->query(
            "SELECT p.country, COUNT(*) as retiredCount
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY p.country
             ORDER BY retiredCount DESC
             LIMIT 1"
        );
        $row = $stmt->fetch();
        if ($row) {
            return [[
                'category' => 'retirement',
                'text' => $row['country'] . ' has had the most names retired with ' . $row['retiredCount'] . ' retirements — more than any other contributing country.'
            ]];
        }
        return [];
    }

    private function getOnlyRetiredFromLanguage()
    {
        $stmt = $this->conn->query(
            "SELECT tn.language, COUNT(*) as retiredCount,
                    GROUP_CONCAT(tn.name ORDER BY tn.lastYear SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             HAVING retiredCount = 1"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'retirement',
                'text' => $row['names'] . ' is the only ' . $row['language'] . '-origin name that was ever retired.'
            ];
        }
        return $facts;
    }

    private function getStrongestStormFacts()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, s.year, s.intensity
             FROM storms s
             WHERE s.isStrongest = 1
             ORDER BY s.year DESC
             LIMIT 5"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $label = $this->intensityLabel($row['intensity']);
            $facts[] = [
                'category' => 'records',
                'text' => $row['name'] . ' (' . $row['year'] . ') was the strongest storm of its season, reaching ' . $label . ' intensity.'
            ];
        }
        return $facts;
    }

    private function getNameUsedAcrossIntensities()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(DISTINCT s.intensity) as intensityCount,
                    MIN(s.year) as firstYear, MAX(s.year) as lastYear
             FROM storms s
             WHERE s.intensity != 'TD'
             GROUP BY s.name
             HAVING intensityCount >= 5
             ORDER BY intensityCount DESC
             LIMIT 3"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'variety',
                'text' => $row['name'] . ' has produced storms across ' . $row['intensityCount'] . ' different intensity levels — from weak tropical storms to powerful typhoons.'
            ];
        }
        return $facts;
    }

    private function getShortestLivedNames()
    {
        $stmt = $this->conn->query(
            "SELECT tn.name, tn.lastYear, COUNT(s.id) as useCount
             FROM typhoonnames tn
             LEFT JOIN storms s ON s.name = tn.name
             WHERE tn.isRetired = 1 AND tn.isReplaced = 1 AND tn.lastYear IS NOT NULL
               AND tn.isLanguageProblem = 0
             GROUP BY tn.name, tn.lastYear
             HAVING useCount = 1
             ORDER BY tn.lastYear DESC
             LIMIT 5"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'retirement',
                'text' => $row['name'] . ' was retired after its very first use in ' . $row['lastYear'] . ' — one and done.'
            ];
        }
        return $facts;
    }

    private function getMostCat5Names()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as cat5Count
             FROM storms s
             WHERE s.intensity = '5'
             GROUP BY s.name
             HAVING cat5Count >= 2
             ORDER BY cat5Count DESC"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'records',
                'text' => $row['name'] . ' has reached Category 5 intensity ' . $row['cat5Count'] . ' times across different seasons.'
            ];
        }
        return $facts;
    }

    private function getSameYearFirstAndLast()
    {
        $stmt = $this->conn->query(
            "SELECT first_s.name as firstName, last_s.name as lastName, first_s.year
             FROM storms first_s
             INNER JOIN storms last_s ON first_s.year = last_s.year
             WHERE first_s.isFirst = 1 AND last_s.isLast = 1
               AND first_s.name = last_s.name
               AND first_s.id != last_s.id"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'records',
                'text' => 'In ' . $row['year'] . ', the name ' . $row['firstName'] . ' was used for both the first and last storm of the season.'
            ];
        }
        return $facts;
    }

    private function getLanguageWithMostActiveNames()
    {
        $stmt = $this->conn->query(
            "SELECT tn.language, COUNT(*) as activeCount
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             ORDER BY activeCount DESC
             LIMIT 1"
        );
        $row = $stmt->fetch();
        if ($row) {
            return [[
                'category' => 'naming',
                'text' => $row['language'] . ' is the most represented language on the current naming list with ' . $row['activeCount'] . ' active names.'
            ]];
        }
        return [];
    }

    private function getNameRetiredOnFirstUse()
    {
        $stmt = $this->conn->query(
            "SELECT tn.name, tn.lastYear, tn.isLanguageProblem
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.isLanguageProblem > 0
             ORDER BY tn.lastYear DESC"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $reason = (int)$row['isLanguageProblem'] === 2
                ? 'due to a spelling correction'
                : 'due to a language or cultural issue rather than storm damage';
            $facts[] = [
                'category' => 'naming',
                'text' => $row['name'] . ' was retired ' . $reason . '.'
            ];
        }
        return $facts;
    }

    private function getMostReplacedPosition()
    {
        $stmt = $this->conn->query(
            "SELECT tn.position, p.country, COUNT(*) as replaceCount
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.isRetired = 1 AND tn.isReplaced = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.position, p.country
             ORDER BY replaceCount DESC
             LIMIT 1"
        );
        $row = $stmt->fetch();
        if ($row) {
            return [[
                'category' => 'naming',
                'text' => 'Position #' . $row['position'] . ' (' . $row['country'] . ') has gone through ' . $row['replaceCount'] . ' name changes — the most of any slot on the naming list.'
            ]];
        }
        return [];
    }

    private function getYearWithMostRetirements()
    {
        $stmt = $this->conn->query(
            "SELECT tn.lastYear, COUNT(*) as retiredCount,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.lastYear IS NOT NULL AND tn.isLanguageProblem = 0
             GROUP BY tn.lastYear
             ORDER BY retiredCount DESC
             LIMIT 1"
        );
        $row = $stmt->fetch();
        if ($row && $row['retiredCount'] >= 2) {
            return [[
                'category' => 'retirement',
                'text' => $row['lastYear'] . ' saw the most name retirements in a single season with ' . $row['retiredCount'] . ' names retired: ' . $row['names'] . '.'
            ]];
        }
        return [];
    }

    private function getRareTags()
    {
        $stmt = $this->conn->query(
            "SELECT tn.tag, COUNT(*) as cnt,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             HAVING cnt <= 2
             ORDER BY cnt ASC"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $cnt = (int)$row['cnt'];
            if ($cnt === 1) {
                $facts[] = [
                    'category' => 'rarity',
                    'text' => $row['names'] . ' is the only active name in the "' . $row['tag'] . '" category on the entire naming list.'
                ];
            } else {
                $facts[] = [
                    'category' => 'rarity',
                    'text' => 'There are only ' . $cnt . ' active names categorized as "' . $row['tag'] . '": ' . $row['names'] . '.'
                ];
            }
        }
        return $facts;
    }

    private function getAlwaysCat5Names()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as totalUses
             FROM storms s
             WHERE s.name IN (
                 SELECT s2.name FROM storms s2
                 GROUP BY s2.name
                 HAVING COUNT(*) >= 2
                    AND COUNT(*) = SUM(CASE WHEN s2.intensity = '5' THEN 1 ELSE 0 END)
             )
             GROUP BY s.name"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' has reached Category 5 every single time it was used (' . $row['totalUses'] . ' times) — a perfect record of destruction.'
            ];
        }
        return $facts;
    }

    private function getNeverAboveTS()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as useCount
             FROM storms s
             INNER JOIN typhoonnames tn ON s.name = tn.name
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY s.name
             HAVING useCount >= 4
                AND SUM(CASE WHEN s.intensity IN ('1','2','3','4','5') THEN 1 ELSE 0 END) = 0"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' has been used ' . $row['useCount'] . ' times but has never reached typhoon intensity — always staying at tropical storm level or below.'
            ];
        }
        return $facts;
    }

    private function getCountriesNeverRetired()
    {
        $stmt = $this->conn->query(
            "SELECT DISTINCT p.country
             FROM positions p
             INNER JOIN typhoonnames tn ON tn.position = p.id
             WHERE p.id BETWEEN 1 AND 140
               AND p.country NOT IN (
                   SELECT DISTINCT p2.country
                   FROM typhoonnames tn2
                   INNER JOIN positions p2 ON tn2.position = p2.id
                   WHERE tn2.isRetired = 1 AND p2.id BETWEEN 1 AND 140
               )
             ORDER BY p.country"
        );
        $rows = $stmt->fetchAll();
        if (count($rows) > 0 && count($rows) <= 3) {
            $countries = array_column($rows, 'country');
            $list = implode(', ', $countries);
            return [[
                'category' => 'rarity',
                'text' => 'Only ' . count($rows) . ' contributing ' . (count($rows) === 1 ? 'country has' : 'countries have') . ' never had a name retired: ' . $list . '.'
            ]];
        }
        return [];
    }

    private function getOnlyNameFromLanguage()
    {
        $stmt = $this->conn->query(
            "SELECT tn.language, tn.name
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             HAVING COUNT(*) = 1"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only active name from the ' . $row['language'] . ' language on the current naming list.'
            ];
        }
        return $facts;
    }

    private function getOnlyCrossBasinNames()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as cnt, p.country,
                    MIN(s.year) as firstYear, MAX(s.year) as lastYear
             FROM storms s
             INNER JOIN positions p ON s.position = p.id
             WHERE s.position IN (141, 142, 143)
             GROUP BY s.name, p.country
             HAVING cnt >= 2
             ORDER BY cnt DESC
             LIMIT 3"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' crossed into the Western Pacific basin from ' . $row['country'] . ' ' . $row['cnt'] . ' times — a rare cross-basin traveler.'
            ];
        }

        $stmtTotal = $this->conn->query(
            "SELECT COUNT(DISTINCT name) as total FROM storms WHERE position IN (141, 142, 143)"
        );
        $total = $stmtTotal->fetch();
        if ($total && (int)$total['total'] > 0) {
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Only ' . $total['total'] . ' storms in the database originally formed outside the Western Pacific basin.'
            ];
        }

        return $facts;
    }

    private function getNameAlwaysStrongest()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as strongestCount
             FROM storms s
             WHERE s.isStrongest = 1
             GROUP BY s.name
             HAVING strongestCount >= 2
             ORDER BY strongestCount DESC"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' was the strongest storm of the season ' . $row['strongestCount'] . ' different times — a name that keeps making history.'
            ];
        }
        return $facts;
    }

    private function getOnlyTDNames()
    {
        $stmt = $this->conn->query(
            "SELECT s.name, COUNT(*) as useCount
             FROM storms s
             INNER JOIN typhoonnames tn ON s.name = tn.name
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY s.name
             HAVING useCount >= 2
                AND SUM(CASE WHEN s.intensity != 'TD' THEN 1 ELSE 0 END) = 0"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' has been used ' . $row['useCount'] . ' times but never developed beyond Tropical Depression — the weakest classification.'
            ];
        }
        return $facts;
    }

    private function getRareRetirementReasons()
    {
        $facts = [];

        // isLanguageProblem = 3 is the rarest reason
        $stmt = $this->conn->query(
            "SELECT tn.name, tn.note
             FROM typhoonnames tn
             WHERE tn.isLanguageProblem = 3"
        );
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $note = $row['note'] ? ' (' . $row['note'] . ')' : '';
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only name retired for a unique historical reason' . $note . '.'
            ];
        }

        // Names retired for cultural reasons (isLanguageProblem = 1)
        $stmt2 = $this->conn->query(
            "SELECT COUNT(*) as cnt FROM typhoonnames WHERE isLanguageProblem = 1"
        );
        $row2 = $stmt2->fetch();
        if ($row2 && (int)$row2['cnt'] > 0) {
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Only ' . $row2['cnt'] . ' ' . ((int)$row2['cnt'] === 1 ? 'name has' : 'names have') . ' been retired due to cultural or language sensitivities rather than storm damage.'
            ];
        }

        return $facts;
    }

    private function getOnlyNameFromLanguageInTag()
    {
        $stmt = $this->conn->query(
            "SELECT tn.name, tn.language, tn.tag
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language, tn.tag
             HAVING COUNT(*) = 1"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only ' . $row['language'] . ' name in the "' . $row['tag'] . '" category.'
            ];
        }
        return $facts;
    }

    private function getOnlyNameFromCountryInTag()
    {
        $stmt = $this->conn->query(
            "SELECT tn.name, p.country, tn.tag
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY p.country, tn.tag
             HAVING COUNT(*) = 1"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only name contributed by ' . $row['country'] . ' in the "' . $row['tag'] . '" category.'
            ];
        }
        return $facts;
    }

    private function getOnlyRetiredInTag()
    {
        $stmt = $this->conn->query(
            "SELECT tn.tag,
                    SUM(CASE WHEN tn.isRetired = 1 THEN 1 ELSE 0 END) as retiredCnt,
                    COUNT(*) as totalCnt,
                    GROUP_CONCAT(CASE WHEN tn.isRetired = 1 THEN tn.name END ORDER BY tn.name SEPARATOR ', ') as retiredNames
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             HAVING retiredCnt = 1 AND totalCnt >= 3"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['retiredNames'] . ' is the only name ever retired from the "' . $row['tag'] . '" category (out of ' . $row['totalCnt'] . ' names).'
            ];
        }
        return $facts;
    }

    private function getOnlyCat5FromCountry()
    {
        $stmt = $this->conn->query(
            "SELECT tn.name, p.country
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             INNER JOIN storms s ON s.name = tn.name
             WHERE s.intensity = '5' AND tn.position BETWEEN 1 AND 140
             GROUP BY p.country
             HAVING COUNT(DISTINCT tn.name) = 1"
        );
        $rows = $stmt->fetchAll();
        $facts = [];
        foreach ($rows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only name from ' . $row['country'] . ' that has ever produced a Category 5 storm.'
            ];
        }
        return $facts;
    }

    private function getCrossBasinFacts()
    {
        $facts = [];
        $basinNames = [
            141 => 'Central Pacific',
            142 => 'Eastern Pacific',
            143 => 'North Indian Ocean',
        ];

        // Per-basin counts
        $stmt = $this->conn->query(
            "SELECT s.position, COUNT(*) as cnt
             FROM storms s
             WHERE s.position IN (141, 142, 143)
             GROUP BY s.position
             ORDER BY cnt DESC"
        );
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $pos = (int)$row['position'];
            $basin = $basinNames[$pos] ?? 'another basin';
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['cnt'] . ' ' . ($row['cnt'] == 1 ? 'storm has' : 'storms have') . ' crossed into the Western Pacific from the ' . $basin . '.'
            ];
        }

        // Strongest cross-basin storm per basin
        $stmtStrong = $this->conn->query(
            "SELECT s.name, s.year, s.intensity, s.position
             FROM storms s
             WHERE s.position IN (141, 142, 143)
               AND s.intensity IN ('4', '5')
             ORDER BY FIELD(s.intensity, '5', '4'), s.year DESC"
        );
        $strongRows = $stmtStrong->fetchAll();
        $seenBasins = [];
        foreach ($strongRows as $row) {
            $pos = (int)$row['position'];
            if (isset($seenBasins[$pos])) continue;
            $seenBasins[$pos] = true;
            $basin = $basinNames[$pos] ?? 'another basin';
            $label = $this->intensityLabel($row['intensity']);
            $facts[] = [
                'category' => 'records',
                'text' => $row['name'] . ' (' . $row['year'] . ') is the strongest storm to cross from the ' . $basin . ' into the Western Pacific, reaching ' . $label . '.'
            ];
        }

        // Basins with only 1 storm — highlight rarity
        foreach ($rows as $row) {
            if ((int)$row['cnt'] === 1) {
                $pos = (int)$row['position'];
                $basin = $basinNames[$pos] ?? 'another basin';
                $stmtOne = $this->conn->prepare(
                    "SELECT s.name, s.year FROM storms s WHERE s.position = :pos LIMIT 1"
                );
                $stmtOne->bindParam(':pos', $pos, PDO::PARAM_INT);
                $stmtOne->execute();
                $one = $stmtOne->fetch();
                if ($one) {
                    $facts[] = [
                        'category' => 'rarity',
                        'text' => $one['name'] . ' (' . $one['year'] . ') is the only storm ever recorded crossing from the ' . $basin . ' into the Western Pacific.'
                    ];
                }
            }
        }

        // Names that crossed from the same basin multiple times
        $stmtRepeat = $this->conn->query(
            "SELECT s.name, s.position, COUNT(*) as cnt,
                    GROUP_CONCAT(s.year ORDER BY s.year SEPARATOR ', ') as years
             FROM storms s
             WHERE s.position IN (141, 142, 143)
             GROUP BY s.name, s.position
             HAVING cnt >= 2
             ORDER BY cnt DESC"
        );
        $repeatRows = $stmtRepeat->fetchAll();
        foreach ($repeatRows as $row) {
            $pos = (int)$row['position'];
            $basin = $basinNames[$pos] ?? 'another basin';
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only name from the ' . $basin . ' to cross into the Western Pacific more than once (' . $row['years'] . ').'
            ];
        }

        // Oldest cross-basin storm
        $stmtOldest = $this->conn->query(
            "SELECT s.name, s.year, s.position
             FROM storms s
             WHERE s.position IN (141, 142, 143)
             ORDER BY s.year ASC
             LIMIT 1"
        );
        $oldest = $stmtOldest->fetch();
        if ($oldest) {
            $basin = $basinNames[(int)$oldest['position']] ?? 'another basin';
            $facts[] = [
                'category' => 'records',
                'text' => $oldest['name'] . ' (' . $oldest['year'] . ') is the earliest recorded cross-basin storm in the database, originating from the ' . $basin . '.'
            ];
        }

        // Most recent cross-basin storm
        $stmtNewest = $this->conn->query(
            "SELECT s.name, s.year, s.position
             FROM storms s
             WHERE s.position IN (141, 142, 143)
             ORDER BY s.year DESC
             LIMIT 1"
        );
        $newest = $stmtNewest->fetch();
        if ($newest) {
            $basin = $basinNames[(int)$newest['position']] ?? 'another basin';
            $facts[] = [
                'category' => 'records',
                'text' => $newest['name'] . ' (' . $newest['year'] . ') is the most recent storm to cross into the Western Pacific from the ' . $basin . '.'
            ];
        }

        // Years with multiple cross-basin storms
        $stmtYears = $this->conn->query(
            "SELECT s.year, COUNT(*) as cnt,
                    GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR ', ') as names
             FROM storms s
             WHERE s.position IN (141, 142, 143)
             GROUP BY s.year
             HAVING cnt >= 2
             ORDER BY cnt DESC"
        );
        $yearRows = $stmtYears->fetchAll();
        foreach ($yearRows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['year'] . ' saw ' . $row['cnt'] . ' cross-basin storms enter the Western Pacific: ' . $row['names'] . '.'
            ];
        }

        return $facts;
    }

    private function getFirstLetterFacts()
    {
        $facts = [];

        // Most common starting letter among active names
        $stmt = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter, COUNT(*) as cnt
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY letter
             ORDER BY cnt DESC
             LIMIT 1"
        );
        $top = $stmt->fetch();
        if ($top) {
            $facts[] = [
                'category' => 'naming',
                'text' => 'The letter ' . $top['letter'] . ' is the most popular starting letter on the current naming list with ' . $top['cnt'] . ' active names.'
            ];
        }

        // Letters with only 1 active name
        $stmt2 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter, tn.name
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY letter
             HAVING COUNT(*) = 1"
        );
        $soloRows = $stmt2->fetchAll();
        foreach ($soloRows as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only active name starting with the letter ' . $row['letter'] . '.'
            ];
        }

        // Letters where all names have been retired (no active names left)
        $stmt3 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter,
                    SUM(CASE WHEN tn.isRetired = 1 THEN 1 ELSE 0 END) as retiredCnt,
                    SUM(CASE WHEN tn.isRetired = 0 AND tn.isReplaced = 0 THEN 1 ELSE 0 END) as activeCnt
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY letter
             HAVING activeCnt = 0 AND retiredCnt >= 1"
        );
        $deadLetters = $stmt3->fetchAll();
        if (count($deadLetters) > 0) {
            $letters = array_column($deadLetters, 'letter');
            sort($letters);
            $list = implode(', ', $letters);
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Every name that once started with ' . (count($letters) === 1 ? 'the letter ' . $list : 'the letters ' . $list) . ' has been retired — no active names remain.'
            ];
        }

        // Letter with the most retirements
        $stmt4 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter, COUNT(*) as cnt
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY letter
             ORDER BY cnt DESC
             LIMIT 1"
        );
        $topRetired = $stmt4->fetch();
        if ($topRetired && (int)$topRetired['cnt'] >= 3) {
            $facts[] = [
                'category' => 'retirement',
                'text' => 'Names starting with ' . $topRetired['letter'] . ' have been retired ' . $topRetired['cnt'] . ' times — more than any other letter.'
            ];
        }

        // Letters with only 1 retirement
        $stmt5 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter, tn.name
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY letter
             HAVING COUNT(*) = 1"
        );
        $singleRetired = $stmt5->fetchAll();
        foreach ($singleRetired as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['name'] . ' is the only name starting with ' . $row['letter'] . ' to have ever been retired.'
            ];
        }

        // Letters that have never had a retirement
        $stmt6 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY letter
             HAVING SUM(CASE WHEN tn.isRetired = 1 THEN 1 ELSE 0 END) = 0"
        );
        $neverRetired = $stmt6->fetchAll();
        if (count($neverRetired) > 0) {
            $letters = array_column($neverRetired, 'letter');
            sort($letters);
            $list = implode(', ', $letters);
            $facts[] = [
                'category' => 'rarity',
                'text' => 'No name starting with ' . (count($letters) === 1 ? 'the letter ' . $list . ' has' : 'the letters ' . $list . ' has') . ' ever been retired.'
            ];
        }

        return $facts;
    }

    private function getLeastFacts()
    {
        $facts = [];

        // Languages with fewest active names (2-3, not 1 since those are covered by getOnlyNameFromLanguage)
        $stmt = $this->conn->query(
            "SELECT tn.language, COUNT(*) as cnt,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             HAVING cnt BETWEEN 2 AND 3
             ORDER BY cnt ASC"
        );
        foreach ($stmt->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['language'] . ' has only ' . $row['cnt'] . ' active names on the naming list: ' . $row['names'] . '.'
            ];
        }

        // Country with fewest active names
        $stmt2 = $this->conn->query(
            "SELECT p.country, COUNT(*) as cnt
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY p.country
             ORDER BY cnt ASC
             LIMIT 1"
        );
        $row2 = $stmt2->fetch();
        if ($row2) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row2['country'] . ' has the fewest active names on the current list with only ' . $row2['cnt'] . '.'
            ];
        }

        // Country with fewest retirements (non-zero)
        $stmt3 = $this->conn->query(
            "SELECT p.country, COUNT(*) as cnt
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY p.country
             ORDER BY cnt ASC
             LIMIT 1"
        );
        $row3 = $stmt3->fetch();
        if ($row3) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row3['country'] . ' has had the fewest retirements of any country that lost a name, with only ' . $row3['cnt'] . '.'
            ];
        }

        // Tags with fewest active names (2-3, not 1 since those are in getRareTags)
        $stmt4 = $this->conn->query(
            "SELECT tn.tag, COUNT(*) as cnt,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 0 AND tn.isReplaced = 0 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             HAVING cnt BETWEEN 2 AND 4
             ORDER BY cnt ASC"
        );
        foreach ($stmt4->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Only ' . $row['cnt'] . ' active names fall under the "' . $row['tag'] . '" category: ' . $row['names'] . '.'
            ];
        }

        // Letters with fewest storms
        $stmt5 = $this->conn->query(
            "SELECT UPPER(LEFT(s.name, 1)) as letter, COUNT(*) as cnt
             FROM storms s
             GROUP BY letter
             ORDER BY cnt ASC
             LIMIT 3"
        );
        foreach ($stmt5->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Names starting with ' . $row['letter'] . ' have only produced ' . $row['cnt'] . ' storms in the database — the ' . ($row['cnt'] <= 5 ? 'fewest' : 'least') . ' of any letter.'
            ];
        }

        // Languages with fewest retired names (2-3)
        $stmt7 = $this->conn->query(
            "SELECT tn.language, COUNT(*) as cnt,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             HAVING cnt BETWEEN 2 AND 3
             ORDER BY cnt ASC"
        );
        foreach ($stmt7->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['language'] . ' has had only ' . $row['cnt'] . ' names retired: ' . $row['names'] . '.'
            ];
        }

        // Language with most retired names
        $stmt8 = $this->conn->query(
            "SELECT tn.language, COUNT(*) as cnt
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             ORDER BY cnt DESC
             LIMIT 1"
        );
        $topRetiredLang = $stmt8->fetch();
        if ($topRetiredLang) {
            $facts[] = [
                'category' => 'retirement',
                'text' => $topRetiredLang['language'] . ' has had the most names retired of any language with ' . $topRetiredLang['cnt'] . '.'
            ];
        }

        // Language with fewest total names (active + retired, minimum 2)
        $stmt9 = $this->conn->query(
            "SELECT tn.language, COUNT(*) as total
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             HAVING total >= 2
             ORDER BY total ASC
             LIMIT 3"
        );
        foreach ($stmt9->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => $row['language'] . ' has contributed only ' . $row['total'] . ' names in total to the naming list — among the fewest of any language.'
            ];
        }

        // Language with most total names
        $stmt10 = $this->conn->query(
            "SELECT tn.language, COUNT(*) as total
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY tn.language
             ORDER BY total DESC
             LIMIT 1"
        );
        $topTotalLang = $stmt10->fetch();
        if ($topTotalLang) {
            $facts[] = [
                'category' => 'naming',
                'text' => $topTotalLang['language'] . ' has contributed the most names in total with ' . $topTotalLang['total'] . ' (active and retired combined).'
            ];
        }

        // Tags with fewest retired names (2-3)
        $stmt11 = $this->conn->query(
            "SELECT tn.tag, COUNT(*) as cnt,
                    GROUP_CONCAT(tn.name ORDER BY tn.name SEPARATOR ', ') as names
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             HAVING cnt BETWEEN 2 AND 3
             ORDER BY cnt ASC"
        );
        foreach ($stmt11->fetchAll() as $row) {
            $facts[] = [
                'category' => 'rarity',
                'text' => 'Only ' . $row['cnt'] . ' names in the "' . $row['tag'] . '" category have ever been retired: ' . $row['names'] . '.'
            ];
        }

        // Tag with most retirements
        $stmt12 = $this->conn->query(
            "SELECT tn.tag, COUNT(*) as cnt
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             ORDER BY cnt DESC
             LIMIT 1"
        );
        $topRetiredTag = $stmt12->fetch();
        if ($topRetiredTag) {
            $facts[] = [
                'category' => 'retirement',
                'text' => 'The "' . $topRetiredTag['tag'] . '" category has had the most retirements with ' . $topRetiredTag['cnt'] . ' names retired.'
            ];
        }

        // Tag with most total names
        $stmt13 = $this->conn->query(
            "SELECT tn.tag, COUNT(*) as total
             FROM typhoonnames tn
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY tn.tag
             ORDER BY total DESC
             LIMIT 1"
        );
        $topTotalTag = $stmt13->fetch();
        if ($topTotalTag) {
            $facts[] = [
                'category' => 'naming',
                'text' => '"' . $topTotalTag['tag'] . '" is the most popular naming category with ' . $topTotalTag['total'] . ' names in total.'
            ];
        }

        // Country with most total names
        $stmt14 = $this->conn->query(
            "SELECT p.country, COUNT(*) as total
             FROM typhoonnames tn
             INNER JOIN positions p ON tn.position = p.id
             WHERE tn.position BETWEEN 1 AND 140
             GROUP BY p.country
             ORDER BY total DESC
             LIMIT 1"
        );
        $topTotalCountry = $stmt14->fetch();
        if ($topTotalCountry) {
            $facts[] = [
                'category' => 'naming',
                'text' => $topTotalCountry['country'] . ' has contributed the most names in total with ' . $topTotalCountry['total'] . ' (active and retired combined).'
            ];
        }

        // Least retired letter (non-zero, excluding 1 which is covered by getFirstLetterFacts)
        $stmt6 = $this->conn->query(
            "SELECT UPPER(LEFT(tn.name, 1)) as letter, COUNT(*) as cnt
             FROM typhoonnames tn
             WHERE tn.isRetired = 1 AND tn.position BETWEEN 1 AND 140
             GROUP BY letter
             HAVING cnt = 2
             ORDER BY letter"
        );
        $leastRetiredRows = $stmt6->fetchAll();
        if (count($leastRetiredRows) > 0 && count($leastRetiredRows) <= 4) {
            $letters = array_column($leastRetiredRows, 'letter');
            $list = implode(', ', $letters);
            $facts[] = [
                'category' => 'rarity',
                'text' => 'The ' . (count($letters) === 1 ? 'letter ' . $list . ' has' : 'letters ' . $list . ' have') . ' each seen only 2 retirements — the fewest among letters that have lost more than one name.'
            ];
        }

        return $facts;
    }

    private function intensityLabel($intensity)
    {
        $labels = [
            'TD' => 'Tropical Depression',
            'TS' => 'Tropical Storm',
            'STS' => 'Severe Tropical Storm',
            '1' => 'Category 1',
            '2' => 'Category 2',
            '3' => 'Category 3',
            '4' => 'Category 4',
            '5' => 'Category 5'
        ];
        return $labels[$intensity] ?? $intensity;
    }
}
