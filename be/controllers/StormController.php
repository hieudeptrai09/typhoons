<?php
class StormController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getStorms($position = null)
    {
        $query = "SELECT 
                    s.id,
                    s.position,
                    p.country,
                    s.name,
                    s.intensity,
                    s.year,
                    s.isStrongest,
                    s.isFirst
                  FROM Storms s
                  INNER JOIN Positions p ON s.position = p.id";

        if ($position !== null) {
            $query .= " WHERE s.position = :position";
        }

        $query .= " ORDER BY s.year ASC, s.position";

        $stmt = $this->conn->prepare($query);

        if ($position !== null) {
            $stmt->bindParam(':position', $position, PDO::PARAM_INT);
        }

        $stmt->execute();
        $results = $stmt->fetchAll();

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
