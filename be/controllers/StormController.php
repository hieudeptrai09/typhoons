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
                    s.position,
                    s.name,
                    s.intensity,
                    s.year,
                    s.dateStart,
                    s.monthStart,
                    s.dateEnd,
                    s.monthEnd,
                    s.isFromPrevYear
                  FROM storms s
                  WHERE (s.monthStart = :month1 AND s.dateStart = :day1)
                     OR (s.monthEnd = :month2 AND s.dateEnd = :day2)
                  ORDER BY s.year ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':month1', $month, PDO::PARAM_INT);
        $stmt->bindParam(':day1', $day, PDO::PARAM_INT);
        $stmt->bindParam(':month2', $month, PDO::PARAM_INT);
        $stmt->bindParam(':day2', $day, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) use ($day, $month) {
            $row['position'] = (int)$row['position'];
            $row['year'] = (int)$row['year'];
            $row['dateStart'] = (int)$row['dateStart'];
            $row['monthStart'] = (int)$row['monthStart'];
            $row['dateEnd'] = (int)$row['dateEnd'];
            $row['monthEnd'] = (int)$row['monthEnd'];
            $row['isFromPrevYear'] = (int)$row['isFromPrevYear'];

            $startedToday = ($row['monthStart'] === $month && $row['dateStart'] === $day);
            $endedToday = ($row['monthEnd'] === $month && $row['dateEnd'] === $day);
            $row['reason'] = $startedToday && $endedToday ? 'both' : ($startedToday ? 'started' : 'ended');

            unset($row['dateStart'], $row['dateEnd']);

            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }

    public function getActiveOnThisDay($day, $month)
    {
        $query = "SELECT
                    s.position,
                    s.name,
                    s.intensity,
                    s.year,
                    s.dateStart,
                    s.monthStart,
                    s.dateEnd,
                    s.monthEnd,
                    s.isFromPrevYear
                  FROM storms s
                  WHERE (
                      (s.monthEnd > s.monthStart OR (s.monthEnd = s.monthStart AND s.dateEnd >= s.dateStart))
                      AND (s.monthStart < :month1 OR (s.monthStart = :month2 AND s.dateStart <= :day1))
                      AND (s.monthEnd > :month3 OR (s.monthEnd = :month4 AND s.dateEnd >= :day2))
                  ) OR (
                      (s.monthEnd < s.monthStart OR (s.monthEnd = s.monthStart AND s.dateEnd < s.dateStart))
                      AND (
                          (s.monthStart < :month5 OR (s.monthStart = :month6 AND s.dateStart <= :day3))
                          OR (s.monthEnd > :month7 OR (s.monthEnd = :month8 AND s.dateEnd >= :day4))
                      )
                  )
                  ORDER BY s.year ASC";

        $stmt = $this->conn->prepare($query);
        foreach ([1, 2, 3, 4, 5, 6, 7, 8] as $n) {
            $stmt->bindParam(":month$n", $month, PDO::PARAM_INT);
        }
        foreach ([1, 2, 3, 4] as $n) {
            $stmt->bindParam(":day$n", $day, PDO::PARAM_INT);
        }
        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
            $row['position'] = (int)$row['position'];
            $row['year'] = (int)$row['year'];
            $row['dateStart'] = (int)$row['dateStart'];
            $row['monthStart'] = (int)$row['monthStart'];
            $row['dateEnd'] = (int)$row['dateEnd'];
            $row['monthEnd'] = (int)$row['monthEnd'];
            $row['isFromPrevYear'] = (int)$row['isFromPrevYear'];
            return $row;
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }

    public function getFooterHighlight()
    {
        $stmt = $this->conn->query(
            "SELECT name, position FROM storms
             WHERE position BETWEEN 1 AND 140
               AND (monthEnd IS NULL OR monthEnd = 0 OR dateEnd IS NULL OR dateEnd = 0)"
        );
        $ongoing = $stmt->fetchAll();

        if (!empty($ongoing)) {
            $pick = $ongoing[array_rand($ongoing)];
            return ['data' => ['name' => $pick['name'], 'position' => (int)$pick['position']]];
        }

        $stmt = $this->conn->query(
            "SELECT name, position FROM storms
             WHERE position BETWEEN 1 AND 140
             ORDER BY year DESC, monthEnd DESC, dateEnd DESC, id DESC
             LIMIT 1"
        );
        $latest = $stmt->fetch();

        if (!$latest) {
            return ['data' => null];
        }

        return ['data' => ['name' => $latest['name'], 'position' => (int)$latest['position']]];
    }

    public function getStorms()
    {
        $query = "SELECT
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
                  ORDER BY s.year ASC, s.position";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll();

        $results = array_map(function ($row) {
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
        }, $results);

        return [
            'count' => count($results),
            'data' => $results
        ];
    }
}
