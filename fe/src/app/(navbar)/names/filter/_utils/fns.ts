import { normalizeParam } from "../../../../../containers/utils/fns";
import type { TyphoonName } from "../../../../../types";

const toArr = (val: string) => val.split(",").filter(Boolean);
const fmt = (val: string) => toArr(val).join(", ");

export const getPageTitle = (
  name: string | string[] | undefined,
  country: string | string[] | undefined,
  language: string | string[] | undefined,
  letter: string | string[] | undefined,
  position?: string | string[] | undefined,
): string[] => {
  const parts: string[] = [];

  const nameStr = normalizeParam(name);
  const countryStr = normalizeParam(country);
  const languageStr = normalizeParam(language);
  const letterStr = normalizeParam(letter);
  const positionStr = normalizeParam(position);

  if (nameStr) parts.push(`"${fmt(nameStr)}"`);
  if (countryStr) parts.push(fmt(countryStr));
  if (languageStr) parts.push(fmt(languageStr));
  if (positionStr) parts.push(`Position ${fmt(positionStr)}`);

  if (!nameStr && !countryStr && !languageStr && !positionStr) {
    parts.push(`Letter ${letterStr || "A"}`);
  }

  return parts;
};

export const getPageDescription = (
  name: string | string[] | undefined,
  country: string | string[] | undefined,
  language: string | string[] | undefined,
  letter: string | string[] | undefined,
  position?: string | string[] | undefined,
): string => {
  const parts: string[] = [];

  const nameStr = normalizeParam(name);
  const countryStr = normalizeParam(country);
  const languageStr = normalizeParam(language);
  const letterStr = normalizeParam(letter);
  const positionStr = normalizeParam(position);

  if (nameStr) parts.push(`names matching "${fmt(nameStr)}"`);
  if (countryStr) parts.push(`names from ${fmt(countryStr)}`);
  if (languageStr) parts.push(`names in ${fmt(languageStr)}`);
  if (positionStr) parts.push(`names at position ${fmt(positionStr)}`);

  if (!nameStr && !countryStr && !languageStr && !positionStr && letterStr) {
    parts.push(`typhoon names starting with letter ${letterStr}`);
  }

  if (parts.length > 0) {
    return `Filter and search ${parts.join(
      ", ",
    )}. Browse both current and retired typhoon names with detailed information about their meanings and origins.`;
  }

  return "Advanced filtering for all typhoon names (current and retired). Search by name, country, language, position, or browse alphabetically. View complete details including meanings, images, and descriptions.";
};

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
