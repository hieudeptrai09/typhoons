import { normalizeParam } from "../../../../../containers/utils/fns";

export const getRetiredNamesTitle = (
  name?: string | string[],
  year?: string | string[],
  country?: string | string[],
  lang?: string | string[],
  letter?: string | string[],
): string[] => {
  const parts: string[] = [];

  const nameStr = normalizeParam(name);
  const yearStr = normalizeParam(year);
  const countryStr = normalizeParam(country);
  const langStr = normalizeParam(lang);
  const letterStr = normalizeParam(letter);

  if (nameStr) {
    parts.push(`"${nameStr}"`);
  }

  if (yearStr) {
    parts.push(`Year ${yearStr}`);
  }

  if (countryStr) {
    parts.push(countryStr);
  }

  if (langStr) {
    // Parse comma-separated values
    const reasons = langStr
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

  if (!nameStr && !yearStr && !countryStr && !langStr && letterStr) {
    parts.push(`Letter ${letterStr}`);
  }

  return parts;
};

export const getRetiredNamesDescription = (
  name?: string | string[],
  year?: string | string[],
  country?: string | string[],
  lang?: string | string[],
  letter?: string | string[],
): string => {
  const parts: string[] = [];

  const nameStr = normalizeParam(name);
  const yearStr = normalizeParam(year);
  const countryStr = normalizeParam(country);
  const langStr = normalizeParam(lang);
  const letterStr = normalizeParam(letter);

  if (nameStr) {
    parts.push(`retired typhoon name "${nameStr}"`);
  }
  if (yearStr) {
    parts.push(`storms from ${yearStr}`);
  }
  if (countryStr) {
    parts.push(`names from ${countryStr}`);
  }
  if (langStr) {
    const reasons = langStr
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
  if (!nameStr && !yearStr && !countryStr && !langStr && letterStr) {
    parts.push(`retired typhoon names starting with letter ${letterStr}`);
  }

  if (parts.length > 0) {
    return `Explore ${parts.join(
      ", ",
    )} and their suggested replacements. Learn about the history and reasons behind typhoon name retirements.`;
  }

  return "Discover retired typhoon names and the devastating storms that led to their removal from the naming list. View suggested replacements and learn the stories behind each retirement.";
};
