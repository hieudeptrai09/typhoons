export const getRetiredNamesTitle = (name, year, country, lang) => {
  const parts = [];

  if (name) {
    parts.push(`"${name}"`);
  }

  if (year) {
    parts.push(`Year ${year}`);
  }

  if (country) {
    parts.push(country);
  }

  if (lang) {
    if (lang === "language") {
      parts.push("Language");
    } else if (lang === "destructive") {
      parts.push("Destructive");
    }
  }

  return parts;
};
