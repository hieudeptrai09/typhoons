"use client";

import { topSuggestions } from "@/lib/utils/fuzzy";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The 404 page is one static page shared by every dead URL, so it can't be handed the name
// that was typed — it reads it back off the path and matches in the browser. Renders
// nothing unless the path looks like /info/<name> and something came close.
const typedName = (pathname: string): string | null => {
  const match = /^\/info\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    // A stray "%" makes decodeURIComponent throw; the raw segment is still printable.
    return match[1];
  }
};

const NameSuggestions = ({ allNames }: { allNames: string[] }) => {
  const typed = typedName(usePathname());
  if (typed === null) return null;

  const similar = topSuggestions(typed, allNames);
  if (similar.length === 0) return null;

  return (
    <div className="mb-10 -mt-6">
      <p className="mb-3 text-base text-slate-600">
        No typhoon name matches <span className="font-semibold">&ldquo;{typed}&rdquo;</span>. Did
        you mean
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {similar.map((name) => (
          <li key={name}>
            <Link
              href={`/info/${encodeURIComponent(name.toLowerCase())}/`}
              className="inline-block rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700 capitalize transition-colors hover:text-sky-700!"
            >
              {name.toLowerCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NameSuggestions;
