import { Button } from "antd";

interface LetterConfig {
  isAvailable: boolean;
  colorClass: string;
}

interface LetterNavigationProps {
  onLetterChange: (letter: string) => void;
  getLetterConfig: (letter: string) => LetterConfig;
}

const LetterNavigation = ({ onLetterChange, getLetterConfig }: LetterNavigationProps) => {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto mb-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {allLetters.map((letter) => {
          const { isAvailable, colorClass } = getLetterConfig(letter);

          // Extract the active/color intent from the colorClass string to style the antd Button
          const isActive = colorClass.includes("underline decoration-2");
          const isRed = colorClass.includes("text-red");
          const isGreen = colorClass.includes("text-green");
          const isBlue = colorClass.includes("text-blue");

          const getTextColor = () => {
            if (!isAvailable) return "#d1d5db"; // gray-300
            if (isActive) {
              if (isRed) return "#991b1b";
              if (isGreen) return "#166534";
              if (isBlue) return "#1e3a8a";
              return "#1e3a8a";
            }
            if (isRed) return "#ef4444";
            if (isGreen) return "#22c55e";
            if (isBlue) return "#3b82f6";
            return "#374151";
          };

          return (
            <Button
              key={letter}
              type="text"
              disabled={!isAvailable}
              onClick={() => isAvailable && onLetterChange(letter)}
              className={`!min-w-0 !px-2 !text-lg !font-semibold ${isActive ? "!underline !decoration-2 !underline-offset-4" : ""}`}
              style={{ color: getTextColor() }}
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
