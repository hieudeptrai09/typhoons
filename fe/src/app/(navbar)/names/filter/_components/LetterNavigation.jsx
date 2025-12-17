const LetterNavigation = ({
  currentLetter,
  letterStatusMap,
  onLetterChange,
}) => {
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
          const status = letterStatusMap[letter];
          const isAvailable = status && status[0];
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
