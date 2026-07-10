<?php
class SuggestedNameController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getSuggestedNames($nameId = null)
    {
        $query = "SELECT
                    sn.replacementName,
                    sn.meaning as replacementMeaning,
                    sn.isChosen,
                    sn.image
                  FROM suggestednames sn";

        if ($nameId !== null) {
            $query .= " WHERE sn.nameId = :nameId";
        }

        $query .= " ORDER BY sn.id ASC, sn.nameId DESC, sn.isChosen DESC";

        $stmt = $this->conn->prepare($query);

        if ($nameId !== null) {
            $stmt->bindParam(':nameId', $nameId, PDO::PARAM_INT);
        }

        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
            $row['isChosen'] = (int)$row['isChosen'];
            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
