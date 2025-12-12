// Generate dynamic page header title
export const getPageTitle = (searchName, selectedCountry, currentLetter) => {
  const titleParts = [];

  if (searchName) {
    titleParts.push(`"${searchName}"`);
  }

  if (selectedCountry) {
    titleParts.push(selectedCountry);
  }

  if (!searchName && !selectedCountry) {
    titleParts.push(`Letter ${currentLetter}`);
  }

  return titleParts;
};
