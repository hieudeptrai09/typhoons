import { TITLE_COMMON } from "@/lib/constants";
import { BookText, CloudLightning } from "lucide-react";
import Link from "next/link";

// A best-track line as the storm maps draw it: a dashed path with a dot at each fix.
const TRACK_FIXES = [
  [40, 400],
  [161, 359],
  [253, 312],
  [330, 250],
  [392, 185],
  [452, 136],
];

const TrackDecoration = () => (
  <svg
    viewBox="0 0 640 440"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    className="pointer-events-none absolute top-1/2 -right-40 h-[130%] -translate-y-1/2 text-white opacity-15 sm:-right-16 lg:right-0"
    aria-hidden
  >
    <path
      d="M 40 400 C 180 360, 260 320, 330 250 S 440 120, 530 110"
      strokeWidth="3"
      strokeDasharray="10 12"
    />
    {TRACK_FIXES.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="currentColor" stroke="none" />
    ))}
    {/* The tropical cyclone symbol, sitting on the latest fix. */}
    <g transform="translate(530 110) rotate(-15)" strokeWidth="10">
      <circle r="22" />
      <path d="M 22 0 C 22 -38, 0 -58, -44 -62" />
      <path d="M -22 0 C -22 38, 0 58, 44 62" />
    </g>
  </svg>
);

const AboutHero = () => (
  <section className="relative overflow-hidden bg-linear-to-br from-sky-700 via-blue-700 to-indigo-900 text-white">
    <TrackDecoration />

    <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-24 sm:px-8 md:pt-20 md:pb-28">
      <p className="text-sm font-semibold tracking-widest text-sky-200 uppercase">About</p>
      <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
        Every typhoon since 2000, and the story behind its name
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sky-100">
        {TITLE_COMMON} is a database of Western Pacific typhoons — storm tracking, intensity
        analysis, naming history, and the stories behind typhoon names. It is maintained as a
        personal, non-commercial project.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/storms/all/name/"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-800 shadow-sm transition-colors hover:bg-sky-100"
        >
          <CloudLightning size={20} aria-hidden />
          Browse storms
        </Link>
        <Link
          href="/names/current/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/15"
        >
          <BookText size={20} aria-hidden />
          Explore names
        </Link>
      </div>
    </div>
  </section>
);

export default AboutHero;
