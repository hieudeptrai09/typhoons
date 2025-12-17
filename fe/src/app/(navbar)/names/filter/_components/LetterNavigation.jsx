const LetterNavigation = ({
  currentLetter,
  availableLetters,
  retiredLetters,
  aliveLetters,
  onLetterChange,
}) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getLetterColorClass = (letter) => {
    const isAvailable = availableLetters.includes(letter);
    const isActive = currentLetter === letter;
    const hasRetired = retiredLetters.includes(letter);
    const hasAlive = aliveLetters.includes(letter);

    if (!isAvailable) {
      return "text-gray-300 cursor-not-allowed";
    }

    let colorClass = "";

    if (hasRetired && hasAlive) {
      // Both retired and alive names exist - Purple
      colorClass = isActive
        ? "text-purple-800 underline decoration-2"
        : "text-purple-500 hover:text-purple-600 hover:underline";
    } else if (hasRetired && !hasAlive) {
      // Only retired names exist - Red
      colorClass = isActive
        ? "text-red-800 underline decoration-2"
        : "text-red-500 hover:text-red-600 hover:underline";
    } else if (!hasRetired && hasAlive) {
      // Only alive names exist - Blue
      colorClass = isActive
        ? "text-blue-800 underline decoration-2"
        : "text-blue-500 hover:text-blue-600 hover:underline";
    }

    return colorClass;
  };

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {allLetters.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          const colorClass = getLetterColorClass(letter);

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterChange(letter)}
              disabled={!isAvailable}
              className={`text-lg font-semibold transition-all underline-offset-4 ${colorClass}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LetterNavigation;
