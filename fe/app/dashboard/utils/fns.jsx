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
  // Filter storms that are marked as strongest
  return stormsData.filter((storm) => storm.isStrongest);
};

export const getFirstPerYear = (stormsData) => {
  // Filter storms that are marked as first
  return stormsData.filter((storm) => storm.isFirst);
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
