// Generate dynamic page header title
export const getPageTitle = (
  searchName,
  selectedCountry,
  selectedLanguage,
  currentLetter
) => {
  const titleParts = [];

  if (searchName) {
    titleParts.push(`"${searchName}"`);
  }

  if (selectedCountry) {
    titleParts.push(selectedCountry);
  }

  if (selectedLanguage) {
    titleParts.push(selectedLanguage);
  }

  if (!searchName && !selectedCountry && !selectedLanguage) {
    titleParts.push(`Letter ${currentLetter}`);
  }

  return titleParts;
};

export const getPageDescription = (name, country, language, letter) => {
  const parts = [];

  if (name) {
    parts.push(`names matching "${name}"`);
  }
  if (country) {
    parts.push(`names from ${country}`);
  }
  if (language) {
    parts.push(`names in ${language}`);
  }
  if (!name && !country && !language && letter) {
    parts.push(`typhoon names starting with letter ${letter}`);
  }

  if (parts.length > 0) {
    return `Filter and search ${parts.join(
      ", "
    )}. Browse both current and retired typhoon names with detailed information about their meanings and origins.`;
  }

  return "Advanced filtering for all typhoon names (current and retired). Search by name, country, language, or browse alphabetically. View complete details including meanings, images, and descriptions.";
};

export const categorizeLettersByStatus = (namesList) => {
  const letterStatusMap = {};

  // Single pass through all names to build the map
  namesList.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(Number(name.isRetired));

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
