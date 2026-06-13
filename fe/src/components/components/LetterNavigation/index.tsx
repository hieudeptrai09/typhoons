import { Button } from "antd";

interface LetterConfig {
  isAvailable: boolean;
  color: string;
  isActive?: boolean;
}

interface LetterNavigationProps {
  onLetterChange: (letter: string) => void;
  getLetterConfig: (letter: string) => LetterConfig;
}

const LetterNavigation = ({ onLetterChange, getLetterConfig }: LetterNavigationProps) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-0">
        {allLetters.map((letter) => {
          const { isAvailable, color, isActive } = getLetterConfig(letter);
          return (
            <Button
              key={letter}
              type="text"
              disabled={!isAvailable}
              onClick={() => isAvailable && onLetterChange(letter)}
              className={`!min-w-0 !px-1 !text-base !font-semibold ${isActive ? "!underline !decoration-2 !underline-offset-4" : ""}`}
              style={{ color }}
            >
              {letter}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default LetterNavigation;
