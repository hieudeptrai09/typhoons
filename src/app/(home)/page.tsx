import { getFooterHighlight } from "@/lib/db/api/getFooterHighlight";
import { TITLE_COMMON } from "@/lib/constants";
import type { FooterHighlight } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import Menu from "./_components/Menu";
import QuickActionsMenu from "./_components/QuickActionsMenu";

const FALLBACK_HIGHLIGHT: FooterHighlight = { name: "damrey", position: 1 };

const HomePage = async () => {
  const result = await getFooterHighlight();
  const highlight = result?.data ?? FALLBACK_HIGHLIGHT;

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

        <p className="mb-8 max-w-md text-center text-lg font-semibold text-muted">
          Track typhoons and explore their names
        </p>

        <QuickActionsMenu />

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Menu href="storms" label="Browse Storms" bgColor="#2563eb" hoverBgColor="#1d4ed8" />
          <Menu href="names" label="Explore Names" bgColor="#0d9488" hoverBgColor="#0f766e" />
        </div>
      </div>

      <footer className="bg-slate-900" aria-label="Site footer">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-200">{TITLE_COMMON}</span>
          </p>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-4 text-xs"
          >
            {/* Plain <a> forces a hard navigation, bypassing the @modal/(.)info interceptor  */}
            <a
              href={`/info/${encodeURIComponent(highlight.name.toLowerCase())}`}
              className="text-slate-400 transition-colors hover:text-slate-200!"
            >
              Info
            </a>
            <Link
              href={`/positions/${highlight.position}`}
              className="text-slate-400 transition-colors hover:text-slate-200!"
            >
              Positions
            </Link>
            <a
              href="https://www.facebook.com/profile.php?id=61586585781960"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
              className="text-slate-400 transition-colors hover:text-slate-200!"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3.1l.9-4H13V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
