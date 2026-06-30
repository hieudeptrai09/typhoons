<?php
class TyphoonNameController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
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
                s.isLast,
                s.dateStart,
                s.dateEnd,
                s.monthStart,
                s.monthEnd,
                s.isFromPrevYear
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
            $row['dateStart'] = (int)$row['dateStart'];
            $row['dateEnd'] = (int)$row['dateEnd'];
            $row['monthStart'] = (int)$row['monthStart'];
            $row['monthEnd'] = (int)$row['monthEnd'];
            $row['isFromPrevYear'] = (int)$row['isFromPrevYear'];
            return $row;
        }, $storms);

        return [
            'data' => [
                'name' => $nameRow ?: null,
                'storms' => $storms,
            ]
        ];
    }

    public function getTyphoonNames($isRetired = null)
    {
        $query = "SELECT
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
                  INNER JOIN positions p ON tn.position = p.id";

        if ($isRetired !== null) {
            if ($isRetired == 1) {
                $query .= " WHERE tn.isRetired = :isRetired";
            } else {
                $query .= " WHERE tn.isRetired = :isRetired OR tn.isReplaced = 0";
            }
        }

        $stmt = $this->conn->prepare($query);

        if ($isRetired !== null) {
            $stmt->bindParam(':isRetired', $isRetired, PDO::PARAM_INT);
        }

        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['position'] = (int)$row['position'];
            $row['isRetired'] = (int)$row['isRetired'];
            $row['isReplaced'] = (int)$row['isReplaced'];
            $row['isLanguageProblem'] = (int)$row['isLanguageProblem'];
            $row['lastYear'] = (int)$row['lastYear'];
            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
