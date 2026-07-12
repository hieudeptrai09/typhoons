import { getFooterHighlight } from "@/lib/db/api/getFooterHighlight";
import Footer from "@/lib/layout/Footer";
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

      <Footer />
    </div>
  );
};

export default HomePage;
