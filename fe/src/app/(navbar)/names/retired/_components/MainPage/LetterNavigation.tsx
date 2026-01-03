import { RetiredLetterNavigationProps as LetterNavigationProps } from "../../../../../../types";

const LetterNavigation = ({
  currentLetter,
  availableLettersMap,
  onLetterChange,
}: LetterNavigationProps) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {allLetters.map((letter) => {
          const isAvailable = availableLettersMap[letter];
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
                    ? "text-red-500 underline-offset-4 hover:text-red-600 hover:underline"
                    : "cursor-not-allowed text-gray-300"
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
