<?php
class PositionController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getPositionDetails($position)
    {
        $posStmt = $this->conn->prepare("SELECT id, country FROM positions WHERE id = :position LIMIT 1");
        $posStmt->bindParam(':position', $position, PDO::PARAM_INT);
        $posStmt->execute();
        $posRow = $posStmt->fetch();

        if (!$posRow) {
            return ['data' => null];
        }

        $namesStmt = $this->conn->prepare(
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
            WHERE tn.position = :position
            ORDER BY tn.lastYear ASC, tn.name ASC"
        );
        $namesStmt->bindParam(':position', $position, PDO::PARAM_INT);
        $namesStmt->execute();
        $names = $namesStmt->fetchAll();

        $names = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['position'] = (int)$row['position'];
            $row['isRetired'] = (int)$row['isRetired'];
            $row['isReplaced'] = (int)$row['isReplaced'];
            $row['isLanguageProblem'] = (int)$row['isLanguageProblem'];
            $row['lastYear'] = (int)$row['lastYear'];
            return $row;
        }, $names);

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
            WHERE s.position = :position
            ORDER BY s.year ASC"
        );
        $stormStmt->bindParam(':position', $position, PDO::PARAM_INT);
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
                'position' => (int)$posRow['id'],
                'country' => $posRow['country'],
                'names' => $names,
                'storms' => $storms,
            ]
        ];
    }
}
