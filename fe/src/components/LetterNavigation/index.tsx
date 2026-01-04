interface LetterConfig {
  isAvailable: boolean;
  colorClass: string;
}

interface LetterNavigationProps {
  currentLetter: string;
  onLetterChange: (letter: string) => void;
  getLetterConfig: (letter: string) => LetterConfig;
}

const LetterNavigation = ({
  currentLetter,
  onLetterChange,
  getLetterConfig,
}: LetterNavigationProps) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {allLetters.map((letter) => {
          const { isAvailable, colorClass } = getLetterConfig(letter);

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
