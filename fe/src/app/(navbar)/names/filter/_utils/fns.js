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
