const LetterNavigation = ({
  currentLetter,
  availableLetters,
  onLetterChange,
}) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="max-w-4xl mx-auto mb-6">
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {allLetters.map((letter) => {
          const isAvailable = availableLetters.includes(letter);
          const isActive = currentLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => isAvailable && onLetterChange(letter)}
              disabled={!isAvailable}
              className={`text-lg font-semibold transition-all ${
                isActive
                  ? "text-red-800 underline decoration-2 underline-offset-4"
                  : isAvailable
                  ? "text-red-500 hover:text-red-600 hover:underline underline-offset-4"
                  : "text-gray-300 cursor-not-allowed"
              }`}
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
