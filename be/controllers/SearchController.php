<?php
class SearchController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function search($query)
    {
        $q = '%' . $query . '%';

        $stmt = $this->conn->prepare(
            "SELECT
                tn.id,
                tn.name,
                tn.position,
                p.country,
                tn.isRetired,
                tn.isLanguageProblem,
                tn.note,
                tn.replacementName,
                COUNT(s.id) as stormCount
            FROM typhoonnames tn
            INNER JOIN positions p ON tn.position = p.id
            LEFT JOIN storms s ON s.name = tn.name
            WHERE tn.name LIKE :q1
            GROUP BY tn.id, tn.name, tn.position, p.country, tn.isRetired, tn.isLanguageProblem, tn.note, tn.replacementName

            UNION

            SELECT
                NULL as id,
                s.name,
                s.position,
                p.country,
                0 as isRetired,
                0 as isLanguageProblem,
                NULL as note,
                NULL as replacementName,
                COUNT(s.id) as stormCount
            FROM storms s
            INNER JOIN positions p ON s.position = p.id
            WHERE s.name LIKE :q2
              AND s.name NOT IN (SELECT tn2.name FROM typhoonnames tn2)
            GROUP BY s.name, s.position, p.country

            ORDER BY name ASC"
        );
        $stmt->bindParam(':q1', $q, PDO::PARAM_STR);
        $stmt->bindParam(':q2', $q, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
            $row['id'] = $row['id'] !== null ? (int)$row['id'] : null;
            $row['position'] = (int)$row['position'];
            $row['isRetired'] = (int)$row['isRetired'];
            $row['isLanguageProblem'] = (int)$row['isLanguageProblem'];
            $row['stormCount'] = (int)$row['stormCount'];
            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }

    public function getByName($name)
    {
        $nameStmt = $this->conn->prepare(
            "SELECT
                tn.id,
                tn.name,
                tn.meaning,
                tn.position,
                p.country,
                tn.isRetired,
                tn.isReplaced,
                tn.isLanguageProblem,
                tn.replacementName,
                tn.note,
                tn.language,
                tn.lastYear,
                tn.image,
                tn.description,
                tn.tag
            FROM typhoonnames tn
            INNER JOIN positions p ON tn.position = p.id
            WHERE LOWER(tn.name) = LOWER(:name)
            LIMIT 1"
        );
        $nameStmt->bindParam(':name', $name, PDO::PARAM_STR);
        $nameStmt->execute();
        $nameRow = $nameStmt->fetch();

        if ($nameRow) {
            $nameRow['id'] = (int)$nameRow['id'];
            $nameRow['position'] = (int)$nameRow['position'];
            $nameRow['isRetired'] = (int)$nameRow['isRetired'];
            $nameRow['isReplaced'] = (int)$nameRow['isReplaced'];
            $nameRow['isLanguageProblem'] = (int)$nameRow['isLanguageProblem'];
            $nameRow['lastYear'] = (int)$nameRow['lastYear'];
        }

        $stormStmt = $this->conn->prepare(
            "SELECT
                s.id,
                s.position,
                p.country,
                s.name,
                s.intensity,
                s.map,
                s.correctSpelling,
                s.year,
                s.isStrongest,
                s.isFirst,
                s.isLast
            FROM storms s
            INNER JOIN positions p ON s.position = p.id
            WHERE LOWER(s.name) = LOWER(:name)
            ORDER BY s.year ASC, s.position"
        );
        $stormStmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stormStmt->execute();
        $storms = $stormStmt->fetchAll();

        $storms = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['position'] = (int)$row['position'];
            $row['year'] = (int)$row['year'];
            $row['isStrongest'] = (int)$row['isStrongest'];
            $row['isFirst'] = (int)$row['isFirst'];
            $row['isLast'] = (int)$row['isLast'];
            return $row;
        }, $storms);

        return [
            'data' => [
                'name' => $nameRow ?: null,
                'storms' => $storms,
            ]
        ];
    }

    public function getByNameId($nameId)
    {
        // Fetch the typhoon name
        $stmt = $this->conn->prepare(
            "SELECT
                tn.id,
                tn.name,
                tn.meaning,
                tn.position,
                p.country,
                tn.isRetired,
                tn.isReplaced,
                tn.isLanguageProblem,
                tn.replacementName,
                tn.note,
                tn.language,
                tn.lastYear,
                tn.image,
                tn.description,
                tn.tag
            FROM typhoonnames tn
            INNER JOIN positions p ON tn.position = p.id
            WHERE tn.id = :nameId"
        );
        $stmt->bindParam(':nameId', $nameId, PDO::PARAM_INT);
        $stmt->execute();
        $nameRow = $stmt->fetch();

        if (!$nameRow) {
            return ['data' => null];
        }

        $nameRow['id'] = (int)$nameRow['id'];
        $nameRow['position'] = (int)$nameRow['position'];
        $nameRow['isRetired'] = (int)$nameRow['isRetired'];
        $nameRow['isReplaced'] = (int)$nameRow['isReplaced'];
        $nameRow['isLanguageProblem'] = (int)$nameRow['isLanguageProblem'];
        $nameRow['lastYear'] = (int)$nameRow['lastYear'];

        // Fetch storms by name
        $stormStmt = $this->conn->prepare(
            "SELECT
                s.id,
                s.position,
                p.country,
                s.name,
                s.intensity,
                s.map,
                s.correctSpelling,
                s.year,
                s.isStrongest,
                s.isFirst,
                s.isLast
            FROM storms s
            INNER JOIN positions p ON s.position = p.id
            WHERE LOWER(s.name) = LOWER(:name)
            ORDER BY s.year ASC, s.position"
        );
        $stormStmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stormStmt->execute();
        $storms = $stormStmt->fetchAll();

        $storms = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['position'] = (int)$row['position'];
            $row['year'] = (int)$row['year'];
            $row['isStrongest'] = (int)$row['isStrongest'];
            $row['isFirst'] = (int)$row['isFirst'];
            $row['isLast'] = (int)$row['isLast'];
            return $row;
        }, $storms);

        return [
            'data' => [
                'name' => $nameRow,
                'storms' => $storms,
            ]
        ];
    }
}
