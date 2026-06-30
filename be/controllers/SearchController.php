<?php
class SearchController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getNameList()
    {
        $stmt = $this->conn->prepare(
            "SELECT name FROM typhoonnames
             UNION
             SELECT DISTINCT name FROM storms WHERE position IN (141, 142, 143)
             ORDER BY name"
        );
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

        return [
            'count' => count($results),
            'data' => $results
        ];
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

}
