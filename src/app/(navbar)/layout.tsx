import { TITLE_COMMON } from "@/lib/constants";
import Navbar from "@/lib/layout/NavBar";
import type { ReactNode } from "react";

interface WithNavbarLayoutProps {
  children: ReactNode;
}

export default function WithNavbarLayout({ children }: WithNavbarLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <Navbar />
      <div className="flex-1">{children}</div>
      <footer className="bg-slate-900" aria-label="Site footer">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-6 py-4 text-xs">
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
}
