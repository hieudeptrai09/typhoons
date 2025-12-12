"use client";

import { useRouter } from "next/navigation";
import PageHeader from "../../../components/PageHeader";
import { List, Archive, Filter } from "lucide-react";

const NamesPage = () => {
  const router = useRouter();

  const sections = [
    {
      href: "/names/current",
      title: "Current Typhoon Names",
      description:
        "View the 140 active typhoon names in the official WMO naming list, organized by contributing country",
      icon: List,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      href: "/names/retired",
      title: "Retired Typhoon Names",
      description:
        "Explore names retired due to destructive storms or language issues, along with their replacement names",
      icon: Archive,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
    },
    {
      href: "/names/filter",
      title: "Filter All Names",
      description:
        "Search and filter through all typhoon names (both active and retired) by country and name",
      icon: Filter,
      color: "bg-emerald-600",
      hoverColor: "hover:bg-emerald-700",
    },
  ];

  return (
    <PageHeader title="Typhoon Names">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-600 mb-8 text-lg">
          Discover the fascinating world of typhoon naming conventions and their
          rich cultural heritage
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.href}
                onClick={() => router.push(section.href)}
                className={`${section.color} ${section.hoverColor} rounded-lg p-6 text-white transition-colors text-left shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={28} />
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <p className="text-white/90 leading-relaxed">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 bg-sky-50 rounded-lg p-6 border border-sky-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            About Typhoon Names
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            The World Meteorological Organization (WMO) maintains a list of 140
            typhoon names contributed by 14 member countries and territories in
            the Western Pacific region. Each name reflects the culture, nature,
            or mythology of its contributing nation.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When a typhoon causes exceptional destruction or loss of life, its
            name may be retired and replaced with a new name to honor those
            affected and avoid confusion in historical records.
          </p>
        </div>
      </div>
    </PageHeader>
  );
};

export default NamesPage;
