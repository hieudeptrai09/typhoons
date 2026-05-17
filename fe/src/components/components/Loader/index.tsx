interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-3",
  lg: "h-14 w-14 border-4",
};

const Loader = ({ size = "md" }: LoaderProps) => {
  const sizeClass = SIZE_MAP[size];
  return (
<div className="relative shrink-0" style={{ width: "fit-content" }} role="status" aria-label="Loading">
      <div
        className={`rounded-full border-blue-200 ${sizeClass}`}
        style={{ borderStyle: "solid" }}
      />
      <div
        className={`absolute inset-0 animate-spin rounded-full border-transparent border-t-blue-600 ${sizeClass}`}
        style={{ borderStyle: "solid" }}
      />
    </div>
  );
};

export default Loader;
