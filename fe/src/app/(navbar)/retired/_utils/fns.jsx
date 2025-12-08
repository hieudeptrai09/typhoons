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
    if (lang === "both") {
      parts.push("Language & Destructive");
    } else if (lang === "true") {
      parts.push("Language");
    } else if (lang === "false") {
      parts.push("Destructive");
    }
  }

  return parts;
};
