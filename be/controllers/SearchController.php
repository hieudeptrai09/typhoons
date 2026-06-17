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
                COUNT(s.id) as stormCount
            FROM typhoonnames tn
            INNER JOIN positions p ON tn.position = p.id
            LEFT JOIN storms s ON s.name = tn.name
            WHERE tn.name LIKE :q
            GROUP BY tn.id, tn.name, tn.position, p.country, tn.isRetired, tn.isLanguageProblem
            ORDER BY tn.name ASC"
        );
        $stmt->bindParam(':q', $q, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
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
            WHERE s.name = :name
            ORDER BY s.year ASC, s.position"
        );
        $stormStmt->bindParam(':name', $nameRow['name'], PDO::PARAM_STR);
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

        // Fetch suggestions if retired and position 1-140
        $suggestions = [];
        if ((int)$nameRow['isRetired'] === 1 && (int)$nameRow['position'] >= 1 && (int)$nameRow['position'] <= 140) {
            $sugStmt = $this->conn->prepare(
                "SELECT
                    sn.id,
                    sn.nameId,
                    sn.replacementName,
                    sn.meaning as replacementMeaning,
                    sn.isChosen,
                    sn.image
                FROM suggestednames sn
                WHERE sn.nameId = :nameId
                ORDER BY sn.isChosen DESC, sn.id ASC"
            );
            $sugStmt->bindParam(':nameId', $nameId, PDO::PARAM_INT);
            $sugStmt->execute();
            $suggestions = $sugStmt->fetchAll();

            $suggestions = array_map(function ($row) {
                $row['id'] = (int)$row['id'];
                $row['nameId'] = (int)$row['nameId'];
                $row['isChosen'] = (int)$row['isChosen'];
                return $row;
            }, $suggestions);
        }

        return [
            'data' => [
                'name' => $nameRow,
                'storms' => $storms,
                'suggestions' => $suggestions
            ]
        ];
    }
}
