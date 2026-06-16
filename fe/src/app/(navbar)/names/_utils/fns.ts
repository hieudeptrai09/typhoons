import type { RetiredName } from "../../../../types";

export const REASON_OPTIONS = [
  { value: "0", label: "Destructive Storm" },
  { value: "1", label: "Language Problem" },
  { value: "2", label: "Misspelling" },
  { value: "3", label: "Special Storm" },
];

export const getCellBg = (name: RetiredName): string => {
  if (name.isLanguageProblem === 2) return "bg-amber-100";
  if (Boolean(name.isRetired)) return "bg-red-100";
  return "bg-emerald-100";
};

export const categorizeLettersByStatus = (
  namesList: RetiredName[],
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
