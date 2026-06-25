import Link from "next/link";
import "./not-found.css";

const TyphoonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      className="not-found-arm not-found-arm-1"
      d="M50 50 Q60 30, 50 10 Q40 30, 50 50"
      fill="#2563eb"
    />
    <path
      className="not-found-arm not-found-arm-2"
      d="M50 50 Q70 60, 90 50 Q70 40, 50 50"
      fill="#0d9488"
    />
    <path
      className="not-found-arm not-found-arm-3"
      d="M50 50 Q40 70, 50 90 Q60 70, 50 50"
      fill="#2563eb"
    />
    <path
      className="not-found-arm not-found-arm-4"
      d="M50 50 Q30 40, 10 50 Q30 60, 50 50"
      fill="#0d9488"
    />
    <circle cx="50" cy="50" r="6" fill="#1e3a5f" />
  </svg>
);

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sky-50 px-4">
      <div className="mb-4 flex items-center gap-1">
        <span className="text-8xl font-black text-blue-600/20">4</span>
        <TyphoonIcon className="not-found-icon h-20 w-20" />
        <span className="text-8xl font-black text-blue-600/20">4</span>
      </div>
      <p className="mb-8 text-lg text-slate-500">This page was swept away by a storm.</p>
      <Link
        href="/"
        className="rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFound;
