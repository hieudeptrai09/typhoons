import Image from "next/image";
import Link from "next/link";
import Menu from "./_components/Menu";
import QuickActionsMenu from "./_components/QuickActionsMenu";

const HomePage = () => {
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

        <p className="mb-8 max-w-md text-center text-lg font-semibold text-gray-800">
          Track typhoons and explore their names
        </p>

        <QuickActionsMenu />

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Menu href="storms" label="Browse Storms" bgColor="#2563eb" hoverBgColor="#1d4ed8" />
          <Menu href="names" label="Explore Names" bgColor="#0d9488" hoverBgColor="#0f766e" />
        </div>
      </div>

      <footer className="bg-slate-900" aria-label="Site footer">
        <div className="mx-auto max-w-4xl px-6 py-4 text-center sm:text-left">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm font-semibold text-slate-200">Typhoon Tracker</p>
            <p className="text-xs text-slate-400">
              Storm data and naming history, for informational use only.
            </p>
          </div>

          <div className="mt-3 flex flex-col items-center gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:justify-between">
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center justify-center gap-4 text-xs"
            >
              <Link
                href="/storms"
                className="text-slate-400 transition-colors hover:text-slate-200"
              >
                Storms
              </Link>
              <Link href="/names" className="text-slate-400 transition-colors hover:text-slate-200">
                Names
              </Link>
              <Link
                href="/search"
                className="text-slate-400 transition-colors hover:text-slate-200"
              >
                Search
              </Link>
              {/* Plain <a> (not next/link) forces a hard navigation, bypassing the
                  @modal/(.)info interceptor so this lands on the full page instead of
                  opening as a modal — that modal is reserved for the search page flow. */}
              <a
                href="/info/jebi"
                className="text-slate-400 transition-colors hover:text-slate-200"
              >
                Info
              </a>
              <Link
                href="/positions/1"
                className="text-slate-400 transition-colors hover:text-slate-200"
              >
                Positions
              </Link>
              <a
                href="https://www.facebook.com/profile.php?id=61586585781960"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="text-slate-400 transition-colors hover:text-slate-200"
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

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} JEBI.SE Malakas • Cá Tra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
