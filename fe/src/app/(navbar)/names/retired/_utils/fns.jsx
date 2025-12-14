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

export const getRetiredNamesDescription = (name, year, country, lang) => {
  const parts = [];

  if (name) {
    parts.push(`retired typhoon name "${name}"`);
  }
  if (year) {
    parts.push(`storms from ${year}`);
  }
  if (country) {
    parts.push(`names from ${country}`);
  }
  if (lang === "language") {
    parts.push("names retired due to language problems");
  } else if (lang === "destructive") {
    parts.push("names retired due to destructive storms");
  }

  if (parts.length > 0) {
    return `Explore ${parts.join(
      ", "
    )} and their suggested replacements. Learn about the history and reasons behind typhoon name retirements.`;
  }

  return "Discover retired typhoon names and the devastating storms that led to their removal from the naming list. View suggested replacements and learn the stories behind each retirement.";
};
