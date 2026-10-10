import FrownError from "@/lib/components/FrownError";
import PageHeader from "@/lib/components/PageHeader";
import { getNameList } from "@/lib/db/api/getNameList";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Names A–Z",
  description:
    "Every typhoon name on record — current, retired and from neighbouring basins — in alphabetical order.",
  alternates: { canonical: "/info/" },
};

export default async function InfoIndexPage() {
  const result = await getNameList();
  if (!result?.data) {
    return <FrownError />;
  }

  const byLetter = new Map<string, string[]>();
  [...result.data]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .forEach((name) => {
      const letter = name.charAt(0).toUpperCase();
      byLetter.set(letter, [...(byLetter.get(letter) ?? []), name]);
    });
  const letters = [...byLetter.keys()];

  return (
    <PageHeader title="All Names A–Z">
      <div className="mx-auto max-w-5xl">
        <nav
          className="sticky top-14 z-10 mb-6 flex flex-wrap justify-center gap-1 rounded-lg bg-stone-100/95 py-2"
          aria-label="Jump to letter"
        >
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded text-sm font-semibold text-sky-800 hover:bg-sky-700 hover:text-white"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          {letters.map((letter) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              aria-labelledby={`letter-heading-${letter}`}
              className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2
                id={`letter-heading-${letter}`}
                className="mb-3 text-xl font-bold text-foreground"
              >
                {letter}
              </h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 md:grid-cols-5">
                {byLetter.get(letter)!.map((name) => (
                  <li key={name}>
                    {/* Hundreds of these: prefetching each one on sight costs an ISR read apiece. */}
                    <Link
                      href={`/info/${encodeURIComponent(name.toLowerCase())}/`}
                      prefetch={false}
                      className="text-foreground hover:text-sky-700 hover:underline"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </PageHeader>
  );
}
