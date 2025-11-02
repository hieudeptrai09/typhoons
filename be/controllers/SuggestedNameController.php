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
                    sn.id,
                    sn.nameId,
                    tn.name as originalName,
                    tn.meaning as originalMeaning,
                    sn.replacementName,
                    sn.meaning as replacementMeaning,
                    sn.isChosen
                  FROM suggestednames sn
                  INNER JOIN typhoonnames tn ON sn.nameId = tn.id";

        if ($nameId !== null) {
            $query .= " WHERE sn.nameId = :nameId";
        }

        $query .= " ORDER BY sn.nameId, sn.isChosen DESC";

        $stmt = $this->conn->prepare($query);

        if ($nameId !== null) {
            $stmt->bindParam(':nameId', $nameId, PDO::PARAM_INT);
        }

        $stmt->execute();
        $results = $stmt->fetchAll();

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
