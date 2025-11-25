<?php
class TyphoonNameController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
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
                    tn.note,
                    tn.language,
                    tn.lastYear,
                    tn.image,
                    tn.description
                  FROM typhoonnames tn
                  INNER JOIN positions p ON tn.position = p.id";

        if ($isRetired !== null) {
            if ($isRetired == 1) {
                $query .= " WHERE tn.isRetired = :isRetired";
            } else {
                $query .= " WHERE tn.isRetired = :isRetired OR tn.isReplaced = 0";
            }
        }

        $query .= " ORDER BY tn.lastYear, tn.position, tn.name";

        $stmt = $this->conn->prepare($query);

        if ($isRetired !== null) {
            $stmt->bindParam(':isRetired', $isRetired, PDO::PARAM_INT);
        }

        $stmt->execute();
        $results = $stmt->fetchAll();

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
