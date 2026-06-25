import "./styles.css";

type TyphoonSpinnerSize = "small" | "medium" | "large";

const sizeMap: Record<TyphoonSpinnerSize, number> = {
  small: 24,
  medium: 36,
  large: 56,
};

const TyphoonSpinner = ({ size = "medium" }: { size?: TyphoonSpinnerSize }) => {
  const px = sizeMap[size];

  return (
    <div
      className="typhoon-spinner"
      role="status"
      aria-label="Loading"
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 100 100" width={px} height={px}>
        <path
          className="typhoon-arm typhoon-arm-1"
          d="M50 50 Q60 30, 50 10 Q40 30, 50 50"
          fill="#2563eb"
        />
        <path
          className="typhoon-arm typhoon-arm-2"
          d="M50 50 Q70 60, 90 50 Q70 40, 50 50"
          fill="#0d9488"
        />
        <path
          className="typhoon-arm typhoon-arm-3"
          d="M50 50 Q40 70, 50 90 Q60 70, 50 50"
          fill="#2563eb"
        />
        <path
          className="typhoon-arm typhoon-arm-4"
          d="M50 50 Q30 40, 10 50 Q30 60, 50 50"
          fill="#0d9488"
        />
        <circle className="typhoon-eye" cx="50" cy="50" r="6" fill="#1e3a5f" />
      </svg>
    </div>
  );
};

export default TyphoonSpinner;
