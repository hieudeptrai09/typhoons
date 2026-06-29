<?php
class StormController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getOnThisDay($day, $month)
    {
        $query = "SELECT
                    s.id,
                    s.position,
                    s.name,
                    s.intensity,
                    s.map,
                    s.year,
                    s.dateStart,
                    s.monthStart,
                    s.dateEnd,
                    s.monthEnd,
                    s.isFromPrevYear,
                    p.country,
                    t.meaning
                  FROM storms s
                  INNER JOIN positions p ON s.position = p.id
                  LEFT JOIN typhoonnames t ON t.name = s.name AND t.position = s.position
                  WHERE (s.monthStart = :month1 AND s.dateStart = :day1)
                     OR (s.monthEnd = :month2 AND s.dateEnd = :day2)
                  ORDER BY RAND()
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':month1', $month, PDO::PARAM_INT);
        $stmt->bindParam(':day1', $day, PDO::PARAM_INT);
        $stmt->bindParam(':month2', $month, PDO::PARAM_INT);
        $stmt->bindParam(':day2', $day, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch();

        if ($result) {
            $result['id'] = (int)$result['id'];
            $result['position'] = (int)$result['position'];
            $result['year'] = (int)$result['year'];
            $result['dateStart'] = (int)$result['dateStart'];
            $result['monthStart'] = (int)$result['monthStart'];
            $result['dateEnd'] = (int)$result['dateEnd'];
            $result['monthEnd'] = (int)$result['monthEnd'];
            $result['isFromPrevYear'] = (int)$result['isFromPrevYear'];

            $startedToday = ((int)$result['monthStart'] === $month && (int)$result['dateStart'] === $day);
            $endedToday = ((int)$result['monthEnd'] === $month && (int)$result['dateEnd'] === $day);
            $result['reason'] = $startedToday && $endedToday ? 'both' : ($startedToday ? 'started' : 'ended');
        }

        return [
            'data' => $result ?: null
        ];
    }

    public function getStorms($position = null)
    {
        $query = "SELECT
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
                  INNER JOIN positions p ON s.position = p.id";

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

        $results = array_map(function ($row) {
            $row['id'] = (int)$row['id'];
            $row['position'] = (int)$row['position'];
            $row['year'] = (int)$row['year'];
            $row['isStrongest'] = (int)$row['isStrongest'];
            $row['isFirst'] = (int)$row['isFirst'];
            $row['isLast'] = (int)$row['isLast'];
            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
