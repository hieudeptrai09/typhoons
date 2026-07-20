import { TITLE_COMMON } from "@/lib/constants";
import type { Metadata } from "next";
import { BookOpen, Database, Scale, User } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Western Pacific Typhoon Database — its purpose, data sources, and license.",
  alternates: {
    canonical: "/about/",
  },
};

const sources = [
  {
    name: "Japan Meteorological Agency (JMA)",
    detail: "RSMC Tokyo Typhoon Center — official typhoon names and best-track data.",
    url: "https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/tyname.html",
  },
  {
    name: "Joint Typhoon Warning Center (JTWC)",
    detail: "U.S. Navy/Air Force warnings and intensity estimates (public domain).",
    url: "https://www.metoc.navy.mil/jtwc/jtwc.html",
  },
  {
    name: "Wikipedia",
    detail: "Naming history and background context, used under CC BY-SA 4.0.",
    url: "https://en.wikipedia.org/",
  },
];

const AboutPage = () => {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800">About</h1>

      {/* About the project */}
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
          <BookOpen className="h-5 w-5 text-blue-600" aria-hidden="true" />
          The project
        </h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          {TITLE_COMMON} is a database of Western Pacific typhoons — storm tracking,
          intensity analysis, naming history, and the stories behind typhoon names. It
          covers the Western Pacific basin from 2000 to the present, and is maintained as
          a personal, non-commercial project.
        </p>
      </section>

      {/* Data sources & credits */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
          <Database className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Data sources &amp; credits
        </h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          Facts and figures are compiled from the following sources. Meteorological facts
          themselves aren&apos;t owned by anyone; the credit below acknowledges the
          organisations whose work this database builds upon.
        </p>
        <ul className="mt-4 space-y-3">
          {sources.map((source) => (
            <li
              key={source.name}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {source.name}
              </a>
              <p className="mt-1 text-sm text-slate-500">{source.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* License */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
          <Scale className="h-5 w-5 text-blue-600" aria-hidden="true" />
          License
        </h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          This database is licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer license"
            className="text-blue-600 hover:underline"
          >
            Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
          </a>
          . You are free to share and adapt the data for any purpose, as long as you give
          appropriate credit and distribute your contributions under the same license.
        </p>
      </section>

      {/* Creator / contact */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700">
          <User className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Creator
        </h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          Built and maintained by{" "}
          <span className="font-medium text-slate-700">Cá Tra</span>. Questions or
          corrections are welcome via{" "}
          <a
            href="https://www.facebook.com/profile.php?id=61586585781960"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Facebook
          </a>
          .
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
