import Link from "next/link";
import TyphoonSymbol from "../components/components/TyphoonSpinner/TyphoonSymbol";
import "./not-found.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      {/* Sky */}
      <div className="nf-sky" />

      {/* Sea: ocean + waves bob together */}
      <div className="nf-sea">
        <div className="nf-ocean" />
        <div className="nf-waves">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="nf-wave nf-wave-1">
          <path d="M0,60 C180,20 360,100 540,60 C720,20 900,100 1080,60 C1260,20 1440,80 1440,60 L1440,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="nf-wave nf-wave-2">
          <path d="M0,80 C200,40 400,100 600,70 C800,40 1000,110 1200,70 C1350,40 1440,80 1440,70 L1440,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="nf-wave nf-wave-3">
          <path d="M0,90 C160,60 320,110 480,80 C640,50 800,110 960,80 C1120,50 1280,100 1440,80 L1440,120 L0,120 Z" />
        </svg>
        </div>
      </div>

      {/* Content — blown by wind */}
      <div className="nf-content">
        <div className="nf-blow nf-blow-1 mb-4 flex items-center gap-2">
          <span className="text-8xl font-black text-white/50 select-none sm:text-9xl">4</span>
          <TyphoonSymbol className="not-found-icon h-20 w-20 text-white/80 sm:h-24 sm:w-24" />
          <span className="text-8xl font-black text-white/50 select-none sm:text-9xl">4</span>
        </div>

        <p className="nf-blow nf-blow-2 mb-10 text-lg font-medium tracking-wide text-white/60">
          This page was swept away by a storm.
        </p>

        <Link
          href="/"
          className="nf-btn inline-block rounded-full bg-white/15 px-8 py-3 font-semibold text-white backdrop-blur-sm"
        >
          Return to Safety
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
