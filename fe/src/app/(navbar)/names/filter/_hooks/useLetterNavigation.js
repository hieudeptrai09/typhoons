import { useMemo } from "react";

export const useLetterNavigation = (filteredNames) => {
  // Get available letters (letters that have names)
  const availableLetters = useMemo(() => {
    const letters = new Set();
    filteredNames.forEach((name) => {
      letters.add(name.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [filteredNames]);

  // Get letters where ALL names are retired
  const retiredLetters = useMemo(() => {
    const letterGroups = {};

    // Group names by first letter
    filteredNames.forEach((name) => {
      const letter = name.name.charAt(0).toUpperCase();
      if (!letterGroups[letter]) {
        letterGroups[letter] = [];
      }
      letterGroups[letter].push(name);
    });

    // Check which letters have ALL retired names
    const fullyRetired = [];
    Object.entries(letterGroups).forEach(([letter, namesInLetter]) => {
      const allRetired = namesInLetter.every((name) =>
        Boolean(Number(name.isRetired))
      );
      if (allRetired) {
        fullyRetired.push(letter);
      }
    });

    return fullyRetired;
  }, [filteredNames]);

  return {
    availableLetters,
    retiredLetters,
  };
};
