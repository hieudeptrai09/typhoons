export const getRetiredNamesTitle = (name, year, country, lang, letter) => {
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
    // Parse comma-separated values
    const reasons = lang
      .split(",")
      .map((reason) => {
        switch (reason) {
          case "0":
            return "Destructive";
          case "1":
            return "Language";
          case "2":
            return "Misspelling";
          case "3":
            return "Special";
          default:
            return "";
        }
      })
      .filter(Boolean);

    if (reasons.length > 0) {
      parts.push(reasons.join(", "));
    }
  }

  if (!name && !year && !country && !lang && letter) {
    parts.push(`Letter ${letter}`);
  }

  return parts;
};

export const getRetiredNamesDescription = (name, year, country, lang, letter) => {
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
  if (lang) {
    const reasons = lang
      .split(",")
      .map((reason) => {
        switch (reason) {
          case "0":
            return "destructive storms";
          case "1":
            return "language problems";
          case "2":
            return "misspellings";
          case "3":
            return "special storms";
          default:
            return "";
        }
      })
      .filter(Boolean);

    if (reasons.length > 0) {
      parts.push(`names retired due to ${reasons.join(", ")}`);
    }
  }
  if (!name && !year && !country && !lang && letter) {
    parts.push(`retired typhoon names starting with letter ${letter}`);
  }

  if (parts.length > 0) {
    return `Explore ${parts.join(
      ", ",
    )} and their suggested replacements. Learn about the history and reasons behind typhoon name retirements.`;
  }

  return "Discover retired typhoon names and the devastating storms that led to their removal from the naming list. View suggested replacements and learn the stories behind each retirement.";
};
