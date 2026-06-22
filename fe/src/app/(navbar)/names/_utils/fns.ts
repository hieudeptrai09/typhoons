import type { TyphoonName } from "../../../../types";

export const categorizeLettersByStatus = (
  namesList: TyphoonName[],
): Record<string, [boolean, boolean, boolean]> => {
  const letterStatusMap: Record<string, [boolean, boolean, boolean]> = {};

  namesList.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(name.isRetired);

    if (!letterStatusMap[letter]) letterStatusMap[letter] = [false, false, false];

    letterStatusMap[letter][0] = true;
    if (isRetired) letterStatusMap[letter][1] = true;
    else letterStatusMap[letter][2] = true;
  });

  return letterStatusMap;
};
