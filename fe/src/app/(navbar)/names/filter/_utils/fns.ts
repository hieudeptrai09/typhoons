import type { TyphoonName } from "../../../../../types";

// Generate dynamic page header title
export const getPageTitle = (
  searchName: string | string[] | undefined,
  selectedCountry: string | string[] | undefined,
  selectedLanguage: string | string[] | undefined,
  currentLetter: string | string[] | undefined,
): string[] => {
  const titleParts: string[] = [];

  if (searchName && typeof searchName === "string") {
    titleParts.push(`"${searchName}"`);
  }

  if (selectedCountry && typeof selectedCountry === "string") {
    titleParts.push(selectedCountry);
  }

  if (selectedLanguage && typeof selectedLanguage === "string") {
    titleParts.push(selectedLanguage);
  }

  if (!searchName && !selectedCountry && !selectedLanguage) {
    const letter = typeof currentLetter === "string" ? currentLetter : "A";
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

  if (name && typeof name === "string") {
    parts.push(`names matching "${name}"`);
  }
  if (country && typeof country === "string") {
    parts.push(`names from ${country}`);
  }
  if (language && typeof language === "string") {
    parts.push(`names in ${language}`);
  }
  if (!name && !country && !language && letter && typeof letter === "string") {
    parts.push(`typhoon names starting with letter ${letter}`);
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
