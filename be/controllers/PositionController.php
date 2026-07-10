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
                tn.isRetired,
                tn.isLanguageProblem,
                tn.language,
                tn.image,
                tn.description
            FROM typhoonnames tn
            WHERE tn.position = :position
            ORDER BY tn.lastYear ASC, tn.name ASC"
        );
        $namesStmt->bindParam(':position', $position, PDO::PARAM_INT);
        $namesStmt->execute();
        $names = $namesStmt->fetchAll();

        $names = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['isRetired'] = (int)$row['isRetired'];
            $row['isLanguageProblem'] = (int)$row['isLanguageProblem'];
            return $row;
        }, $names);

        $stormStmt = $this->conn->prepare(
            "SELECT
                s.name,
                s.intensity,
                s.map,
                s.year,
                s.dateStart,
                s.dateEnd,
                s.monthStart,
                s.monthEnd,
                s.isFromPrevYear
            FROM storms s
            WHERE s.position = :position
            ORDER BY s.year ASC"
        );
        $stormStmt->bindParam(':position', $position, PDO::PARAM_INT);
        $stormStmt->execute();
        $storms = $stormStmt->fetchAll();

        $storms = array_map(function ($row) {
            $row['year'] = (int)$row['year'];
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
