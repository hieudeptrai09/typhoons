<?php
class TyphoonNameController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getTyphoonNames($isRetired = null, $name = null)
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

        $conditions = [];
        if ($isRetired !== null) {
            if ($isRetired == 1) {
                $conditions[] = "tn.isRetired = :isRetired";
            } else {
                $conditions[] = "(tn.isRetired = :isRetired OR tn.isReplaced = 0)";
            }
        }
        if ($name !== null) {
            $conditions[] = "tn.name = :name";
        }
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $stmt = $this->conn->prepare($query);

        if ($isRetired !== null) {
            $stmt->bindParam(':isRetired', $isRetired, PDO::PARAM_INT);
        }
        if ($name !== null) {
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
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
