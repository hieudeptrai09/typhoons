import Link from "next/link";

export type NamesScope = "current" | "history" | "retired";

const TABS: { key: NamesScope; label: string }[] = [
  { key: "current", label: "Current" },
  { key: "history", label: "History" },
  { key: "retired", label: "Retired" },
];

interface NamesScopeTabsProps {
  activeScope: NamesScope;
  hrefs: Record<NamesScope, string>;
}

const NamesScopeTabs = ({ activeScope, hrefs }: NamesScopeTabsProps) => (
  <nav aria-label="Name scope" className="mx-auto mb-6 flex max-w-md border-b border-gray-200">
    {TABS.map(({ key, label }) => {
      const isActive = activeScope === key;
      return (
        <Link
          key={key}
          href={hrefs[key]}
          aria-current={isActive ? "page" : undefined}
          className={`flex-1 px-4 pb-3 text-center text-sm font-semibold transition-colors ${
            isActive
              ? "border-b-2 border-sky-700 text-sky-700"
              : "text-foreground hover:text-highlight"
          }`}
        >
          {label}
        </Link>
      );
    })}
  </nav>
);

export default NamesScopeTabs;
