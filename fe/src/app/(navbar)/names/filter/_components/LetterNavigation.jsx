const LetterNavigation = ({ currentLetter, letterStatusMap, onLetterChange }) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getLetterColorClass = (letter) => {
    // Get status array: [hasAny, hasRetired, hasAlive]
    const status = letterStatusMap[letter];
    const isActive = currentLetter === letter;

    // If letter not in map, it has no names
    if (!status || !status[0]) {
      return "text-gray-300 cursor-not-allowed";
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

    return colorClass;
  };

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {allLetters.map((letter) => {
          const status = letterStatusMap[letter];
          const isAvailable = status && status[0];
          const colorClass = getLetterColorClass(letter);

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterChange(letter)}
              disabled={!isAvailable}
              className={`text-lg font-semibold underline-offset-4 transition-all ${colorClass}`}
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
