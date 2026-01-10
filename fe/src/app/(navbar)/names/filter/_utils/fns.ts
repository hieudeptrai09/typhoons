import { normalizeParam } from "../../../../../containers/utils/fns";
import type { TyphoonName } from "../../../../../types";

// Generate dynamic page header title
export const getPageTitle = (
  searchName: string | string[] | undefined,
  selectedCountry: string | string[] | undefined,
  selectedLanguage: string | string[] | undefined,
  currentLetter: string | string[] | undefined,
): string[] => {
  const titleParts: string[] = [];

  const nameStr = normalizeParam(searchName);
  const countryStr = normalizeParam(selectedCountry);
  const languageStr = normalizeParam(selectedLanguage);
  const letterStr = normalizeParam(currentLetter);

  if (nameStr) {
    titleParts.push(`"${nameStr}"`);
  }

  if (countryStr) {
    titleParts.push(countryStr);
  }

  if (languageStr) {
    titleParts.push(languageStr);
  }

  if (!nameStr && !countryStr && !languageStr) {
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
): string => {
  const parts: string[] = [];

  const nameStr = normalizeParam(name);
  const countryStr = normalizeParam(country);
  const languageStr = normalizeParam(language);
  const letterStr = normalizeParam(letter);

  if (nameStr) {
    parts.push(`names matching "${nameStr}"`);
  }
  if (countryStr) {
    parts.push(`names from ${countryStr}`);
  }
  if (languageStr) {
    parts.push(`names in ${languageStr}`);
  }
  if (!nameStr && !countryStr && !languageStr && letterStr) {
    parts.push(`typhoon names starting with letter ${letterStr}`);
  }

  if (parts.length > 0) {
    return `Filter and search ${parts.join(
      ", ",
    )}. Browse both current and retired typhoon names with detailed information about their meanings and origins.`;
  }

  return "Advanced filtering for all typhoon names (current and retired). Search by name, country, language, or browse alphabetically. View complete details including meanings, images, and descriptions.";
};

export const categorizeLettersByStatus = (
  namesList: TyphoonName[],
): Record<string, [boolean, boolean, boolean]> => {
  const letterStatusMap: Record<string, [boolean, boolean, boolean]> = {};

  // Single pass through all names to build the map
  namesList.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(name.isRetired);

    // Initialize letter if not exists: [hasAny, hasRetired, hasAlive]
    if (!letterStatusMap[letter]) {
      letterStatusMap[letter] = [false, false, false];
    }

    // Mark as available (has at least one name)
    letterStatusMap[letter][0] = true;

    // Mark status
    if (isRetired) {
      letterStatusMap[letter][1] = true; // Has retired
    } else {
      letterStatusMap[letter][2] = true; // Has alive
    }
  });

  return letterStatusMap;
};
