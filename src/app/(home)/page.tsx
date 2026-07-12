import { TITLE_COMMON } from "@/lib/constants";
import { getFooterHighlight } from "@/lib/db/api/getFooterHighlight";
import type { FooterHighlight } from "@/lib/types";
import { capitalize } from "@/lib/utils/fns";
import Image from "next/image";
import Link from "next/link";
import Menu from "./_components/Menu";
import QuickActionsMenu from "./_components/QuickActionsMenu";

const FALLBACK_HIGHLIGHT: FooterHighlight = { name: "damrey", position: 1, status: "next" };

const HomePage = async () => {
  const result = await getFooterHighlight();
  const highlight = result?.data ?? FALLBACK_HIGHLIGHT;
  const isActive = highlight.status === "active";
  // Positions run 1–140; an active storm can sit outside that range, so hide it there.
  const showPosition = highlight.position >= 1 && highlight.position <= 140;

  return (
    <div className="flex min-h-screen flex-col bg-sky-100">
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <a
          href="https://www.facebook.com/profile.php?id=61586585781960"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4"
        >
          <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
        </a>

        <p className="mb-4 max-w-md text-center text-lg font-semibold text-muted">
          Track typhoons and explore their names
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-medium text-slate-600 shadow-sm">
            <span
              className={`h-2 w-2 rounded-full ${isActive ? "animate-pulse bg-red-500" : "bg-blue-500"}`}
              aria-hidden="true"
            />
            {isActive ? "Active now" : "Up next"}
          </span>

          {/* Plain <a> forces a hard navigation, bypassing the @modal/(.)info interceptor */}
          <a
            href={`/info/${encodeURIComponent(highlight.name.toLowerCase())}`}
            className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
          >
            {capitalize(highlight.name.toLowerCase())}
          </a>

          {showPosition && (
            <Link
              href={`/positions/${highlight.position}`}
              className="text-teal-700 transition-colors hover:text-teal-900"
            >
              #{highlight.position}
            </Link>
          )}
        </div>

        <QuickActionsMenu />

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Menu href="storms" label="Browse Storms" bgColor="#2563eb" hoverBgColor="#1d4ed8" />
          <Menu href="names" label="Explore Names" bgColor="#0d9488" hoverBgColor="#0f766e" />
        </div>
      </div>

      <footer className="bg-slate-900" aria-label="Site footer">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-6 py-4 text-xs">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-200">{TITLE_COMMON}</span>
          </p>

          <a
            href="https://www.facebook.com/profile.php?id=61586585781960"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
            className="text-slate-400 transition-colors hover:text-slate-200!"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3.1l.9-4H13V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
