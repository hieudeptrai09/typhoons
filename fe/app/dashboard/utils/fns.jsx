export const intensityRank = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
  STS: 0.5,
  TS: 0.3,
  TD: 0.1,
};

export const getStrongestPerYear = (stormsData) => {
  const yearlyData = {};
  stormsData.forEach((storm) => {
    const year = storm.year;
    if (
      !yearlyData[year] ||
      (intensityRank[storm.intensity] || 0) >
        (intensityRank[yearlyData[year].intensity] || 0)
    ) {
      yearlyData[year] = storm;
    }
  });
  return Object.values(yearlyData);
};

export const getFirstPerYear = (stormsData) => {
  const yearlyData = {};
  stormsData.forEach((storm) => {
    const year = storm.year;
    if (!yearlyData[year] || storm.date < yearlyData[year].date) {
      yearlyData[year] = storm;
    }
  });
  return Object.values(yearlyData);
};

export const getAverageByPosition = (stormsData) => {
  const positionAvg = {};
  stormsData.forEach((storm) => {
    if (!positionAvg[storm.position]) positionAvg[storm.position] = [];
    positionAvg[storm.position].push(storm);
  });
  return positionAvg;
};

export const getAverageByName = (stormsData) => {
  const nameAvg = {};
  stormsData.forEach((storm) => {
    if (!nameAvg[storm.name]) nameAvg[storm.name] = [];
    nameAvg[storm.name].push(storm);
  });
  return nameAvg;
};
