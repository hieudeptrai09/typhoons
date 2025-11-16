export const getIntensityFromNumber = (avgNumber) => {
  const rounded = Math.round(avgNumber);
  if (rounded >= 5) return "5";
  if (rounded === 4) return "4";
  if (rounded === 3) return "3";
  if (rounded === 2) return "2";
  if (rounded === 1) return "1";
  if (rounded === 0) return "TS";
  if (rounded <= -1) return "TD";
  return "TD";
};

export const getPositionTitle = (position) => {
  if (position === 141) return "CPHC";
  if (position === 142) return "NHC";
  return `#${position}`;
};

export const getStrongestPerYear = (stormsData) => {
  // Filter storms that are marked as strongest
  return stormsData.filter((storm) => Boolean(Number(storm.isStrongest)));
};

export const getFirstPerYear = (stormsData) => {
  // Filter storms that are marked as first
  return stormsData.filter((storm) => Boolean(Number(storm.isFirst)));
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
