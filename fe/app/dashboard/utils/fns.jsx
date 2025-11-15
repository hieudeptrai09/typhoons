export const intensityRank = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
  STS: 0,
  TS: -1,
  TD: -2,
};

export const getIntensityFromNumber = (avgNumber) => {
  const rounded = Math.round(avgNumber);
  if (rounded >= 5) return "5";
  if (rounded === 4) return "4";
  if (rounded === 3) return "3";
  if (rounded === 2) return "2";
  if (rounded === 1) return "1";
  if (rounded === 0) return "STS";
  if (rounded === -1) return "TS";
  if (rounded <= -2) return "TD";
  return "TD";
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
