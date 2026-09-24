import { getStorms } from "@/lib/db/api/getStorms";
import { getTyphoonNames } from "@/lib/db/api/getTyphoonNames";
import { getSeasonYears, isSeasonYear } from "@/lib/utils/storms";
import {
  BookOpen,
  BookText,
  CalendarRange,
  CloudLightning,
  Flag,
  Medal,
  MessageCircle,
  Replace,
  Waves,
  Wind,
} from "lucide-react";
import type { Metadata } from "next";
import AboutHero from "./_components/AboutHero";
import LinkCard from "./_components/LinkCard";
import SectionHeading from "./_components/SectionHeading";
import StatsStrip, { type AboutStat } from "./_components/StatsStrip";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Western Pacific Typhoon Database — its purpose, data sources, and license.",
  alternates: {
    canonical: "/about/",
  },
};

const CONTACT_URL = "https://www.facebook.com/profile.php?id=61586585781960";

const ICON_SIZE = 22;

const features = [
  {
    title: "Storms dashboard",
    href: "/storms/all/name/",
    icon: <CloudLightning size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-sky-100 text-sky-700",
    detail: "Every storm since 2000 on one board, with its intensity, dates and track map.",
  },
  {
    title: "Records",
    href: "/storms/records/season/strongest/",
    icon: <Medal size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-amber-100 text-amber-700",
    detail: "The strongest, first and last storm of each season, and every storm by category.",
  },
  {
    title: "Names in rotation",
    href: "/names/current/",
    icon: <BookText size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-purple-100 text-purple-700",
    detail: "The 140 names on the list today, with their meanings, languages and pronunciations.",
  },
  {
    title: "Retired names",
    href: "/names/retired/",
    icon: <Replace size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-rose-100 text-rose-700",
    detail: "Names taken out of rotation, why they were retired, and the names that replaced them.",
  },
  {
    title: "Countries",
    href: "/countries/",
    icon: <Flag size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-emerald-100 text-emerald-700",
    detail: "The 14 Typhoon Committee members and the storms carrying the names they contributed.",
  },
  {
    title: "Seasons",
    href: "/years/",
    icon: <CalendarRange size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-indigo-100 text-indigo-700",
    detail: "Every season on record, storm by storm in the order they formed.",
  },
];

const sources = [
  {
    name: "Japan Meteorological Agency (JMA)",
    detail: "RSMC Tokyo Typhoon Center — official typhoon names and best-track data.",
    url: "https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/tyname.html",
    icon: <Waves size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-sky-100 text-sky-700",
  },
  {
    name: "Joint Typhoon Warning Center (JTWC)",
    detail: "U.S. Navy/Air Force warnings and intensity estimates (public domain).",
    url: "https://www.metoc.navy.mil/jtwc/jtwc.html",
    icon: <Wind size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-teal-100 text-teal-700",
  },
  {
    name: "Wikipedia",
    detail: "Naming history and background context, used under CC BY-SA 4.0.",
    url: "https://en.wikipedia.org/",
    icon: <BookOpen size={ICON_SIZE} aria-hidden />,
    iconClass: "bg-slate-100 text-slate-700",
  },
];

const getAboutStats = async (): Promise<AboutStat[]> => {
  const [storms, names] = await Promise.all([
    getStorms().then((res) => res.data),
    getTyphoonNames().then((res) => res.data),
  ]);

  return [
    {
      label: "Storms since 2000",
      value: storms.filter((storm) => isSeasonYear(storm.year)).length,
    },
    { label: "Seasons", value: getSeasonYears(storms).length },
    { label: "Names catalogued", value: names.length },
    { label: "Names retired", value: names.filter((name) => name.isRetired).length },
  ];
};

const AboutPage = async () => {
  // The numbers are a garnish: a database hiccup should drop them, not the license and credits below.
  const stats = await getAboutStats().catch(() => null);

  return (
    <main>
      <AboutHero />
      {stats && <StatsStrip stats={stats} />}

      {/* What's inside */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <SectionHeading eyebrow="What's inside" title="Explore the database">
          Storms, names and seasons, each from its own angle.
        </SectionHeading>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.href}>
              <LinkCard
                href={feature.href}
                title={feature.title}
                icon={feature.icon}
                iconClass={feature.iconClass}
              >
                {feature.detail}
              </LinkCard>
            </li>
          ))}
        </ul>
      </section>

      {/* Data sources & credits */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
          <SectionHeading eyebrow="Credits" title="Data sources">
            Facts and figures are compiled from the following sources. Meteorological facts
            themselves aren&apos;t owned by anyone; the credit below acknowledges the organisations
            whose work this database builds upon.
          </SectionHeading>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {sources.map((source) => (
              <li key={source.name}>
                <LinkCard
                  href={source.url}
                  title={source.name}
                  icon={source.icon}
                  iconClass={source.iconClass}
                  isExternal
                >
                  {source.detail}
                </LinkCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* License */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <SectionHeading eyebrow="License" title="Free to use, for anything" />
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:flex">
          <div className="flex flex-col items-center justify-center gap-1 bg-blue-50 px-8 py-8 text-center md:w-64 md:shrink-0">
            <span className="text-5xl font-bold text-blue-700">CC0</span>
            <span className="font-semibold text-slate-700">Public domain</span>
          </div>
          <div className="divide-y divide-slate-200">
            <p className="p-5 leading-relaxed text-slate-600 sm:p-6">
              This database is dedicated to the public domain under{" "}
              <a
                href="https://creativecommons.org/publicdomain/zero/1.0/"
                target="_blank"
                rel="noopener noreferrer license"
                className="text-blue-600 hover:underline"
              >
                Creative Commons Zero 1.0 Universal (CC0 1.0)
              </a>
              . To the extent possible under law, all rights are waived. You are free to copy,
              adapt, and use the data for any purpose, without asking permission — though a credit
              is always appreciated.
            </p>
            <p className="p-5 text-sm leading-relaxed text-slate-600 sm:p-6">
              This dedication covers the{" "}
              <span className="font-medium text-slate-700">data and text</span> of this database
              only. It does not extend to the images, which belong to their respective owners and
              remain under their original copyright. No ownership of, or license over, those images
              is claimed here.
            </p>
            <p className="p-5 text-sm leading-relaxed text-slate-600 sm:p-6">
              Where an image&apos;s author and license are known, they are credited alongside it.
              This is a personal, non-commercial project, and if you are a rights holder who would
              like an image credited differently or removed, please{" "}
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                get in touch
              </a>{" "}
              and I will do so promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Creator / contact */}
      <section className="bg-linear-to-br from-sky-700 via-blue-700 to-indigo-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8">
          <p className="text-sm font-semibold tracking-widest text-sky-200 uppercase">Creator</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Built and maintained by Cá Tra</h2>
          <p className="mt-3 leading-relaxed text-sky-100">
            Spotted a mistake, or have a question? Corrections are always welcome.
          </p>
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-800 shadow-sm transition-colors hover:bg-sky-100"
          >
            <MessageCircle size={20} aria-hidden />
            Message me on Facebook
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
