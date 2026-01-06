export const getPositionTitle = (position: number): string => {
  if (position === 141) return "CPHC";
  if (position === 142) return "NHC";
  if (position === 143) return "IMD";
  return `#${position}`;
};
