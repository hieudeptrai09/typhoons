import { normalizeParam } from "../../../../../containers/utils/fns";
import type { TyphoonName } from "../../../../../types";

export const getPageTitle = (
  searchName: string | string[] | undefined,
  selectedCountry: string | string[] | undefined,
  selectedLanguage: string | string[] | undefined,
  currentLetter: string | string[] | undefined,
  position?: string | string[] | undefined,
): string[] => {
  const titleParts: string[] = [];

  const nameStr = normalizeParam(searchName);
  const countryStr = normalizeParam(selectedCountry);
  const languageStr = normalizeParam(selectedLanguage);
  const letterStr = normalizeParam(currentLetter);
  const positionStr = normalizeParam(position);

  if (nameStr) {
    titleParts.push(`"${nameStr}"`);
  }

  if (countryStr) {
    titleParts.push(countryStr);
  }

  if (languageStr) {
    titleParts.push(languageStr);
  }

  if (positionStr) {
    titleParts.push(`Position #${positionStr}`);
  }

  if (!nameStr && !countryStr && !languageStr && !positionStr) {
    const letter = letterStr || "A";
    titleParts.push(`Letter ${letter}`);
  }

  return titleParts;
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

  if (nameStr) {
    parts.push(`names matching "${nameStr}"`);
  }
  if (countryStr) {
    parts.push(`names from ${countryStr}`);
  }
  if (languageStr) {
    parts.push(`names in ${languageStr}`);
  }
  if (positionStr) {
    parts.push(`names at position #${positionStr}`);
  }
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

    if (!letterStatusMap[letter]) {
      letterStatusMap[letter] = [false, false, false];
    }

    letterStatusMap[letter][0] = true;

    if (isRetired) {
      letterStatusMap[letter][1] = true;
    } else {
      letterStatusMap[letter][2] = true;
    }
  });

  return letterStatusMap;
};
