import type { TyphoonName, RetiredName } from "../../types";

/**
 * Build a map of letters to their status [hasAny, hasRetired, hasAlive]
 */
export const createLetterStatusMap = (
  names: (TyphoonName | RetiredName)[],
): Record<string, [boolean, boolean, boolean]> => {
  const letterStatusMap: Record<string, [boolean, boolean, boolean]> = {};

  names.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    const isRetired = Boolean(name.isRetired);

    if (!letterStatusMap[letter]) {
      letterStatusMap[letter] = [false, false, false];
    }

    letterStatusMap[letter][0] = true; // Has at least one name

    if (isRetired) {
      letterStatusMap[letter][1] = true; // Has retired
    } else {
      letterStatusMap[letter][2] = true; // Has alive
    }
  });

  return letterStatusMap;
};

/**
 * Build a simple availability map for retired names only
 */
export const createRetiredLetterMap = (names: RetiredName[]): Record<string, boolean> => {
  const map: Record<string, boolean> = {};
  names.forEach((name) => {
    const letter = name.name.charAt(0).toUpperCase();
    map[letter] = true;
  });
  return map;
};

/**
 * Get letter configuration for filter page (mixed retired/alive)
 */
export const getFilterLetterConfig = (
  letter: string,
  currentLetter: string,
  statusMap: Record<string, [boolean, boolean, boolean]>,
) => {
  const status = statusMap[letter];
  const isActive = currentLetter === letter;

  // If letter not in map, it has no names
  if (!status || !status[0]) {
    return {
      isAvailable: false,
      colorClass: "text-gray-300 cursor-not-allowed",
    };
  }

  const hasRetired = status[1];
  const hasAlive = status[2];

  let colorClass = "";

  if (hasRetired && hasAlive) {
    colorClass = isActive
      ? "text-blue-800 underline decoration-2"
      : "text-blue-500 hover:text-blue-600 hover:underline";
  } else if (hasRetired && !hasAlive) {
    colorClass = isActive
      ? "text-red-800 underline decoration-2"
      : "text-red-500 hover:text-red-600 hover:underline";
  } else if (!hasRetired && hasAlive) {
    colorClass = isActive
      ? "text-green-800 underline decoration-2"
      : "text-green-500 hover:text-green-600 hover:underline";
  }

  return {
    isAvailable: true,
    colorClass,
  };
};

/**
 * Get letter configuration for retired page (retired only)
 */
export const getRetiredLetterConfig = (
  letter: string,
  currentLetter: string,
  availableMap: Record<string, boolean>,
) => {
  const isAvailable = availableMap[letter];
  const isActive = currentLetter === letter;

  return {
    isAvailable,
    colorClass: isActive
      ? "text-red-800 underline decoration-2 underline-offset-4"
      : isAvailable
        ? "text-red-500 underline-offset-4 hover:text-red-600 hover:underline"
        : "cursor-not-allowed text-gray-300",
  };
};
