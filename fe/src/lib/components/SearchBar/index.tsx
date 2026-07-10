"use client";

import HighlightedName from "@/lib/components/HighlightedName";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Input } from "antd";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

export type SearchBarVariant = "home" | "navbar";

const PLACEHOLDER = "Search typhoon names...";

const VARIANT_CONFIG: Record<
  SearchBarVariant,
  {
    size?: "large";
    prefixClassName: string;
    prefixSize: number;
    inputClassName: string;
  }
> = {
  home: {
    size: "large",
    prefixClassName: "text-muted",
    prefixSize: 18,
    inputClassName: styles.homeInput,
  },
  navbar: {
    prefixClassName: "text-white",
    prefixSize: 16,
    inputClassName: `${styles.navbarInput} w-full`,
  },
};

const SearchBar = ({ variant }: { variant: SearchBarVariant }) => {
  const config = VARIANT_CONFIG[variant];
  const statusId = `${variant}-search-status`;

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: allNames, loading } = useFetchData<string[]>("/search/names");

  const trimmed = query.trim();
  const filtered =
    trimmed && allNames
      ? allNames.filter((name) => name.toLowerCase().includes(trimmed.toLowerCase()))
      : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    setQuery("");
  };

  const handleViewAll = () => {
    setIsDropdownOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && trimmed) {
      handleViewAll();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        size={config.size}
        placeholder={PLACEHOLDER}
        aria-label="Search typhoon names"
        aria-describedby={isDropdownOpen && trimmed ? statusId : undefined}
        prefix={<Search size={config.prefixSize} className={config.prefixClassName} />}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => trimmed && setIsDropdownOpen(true)}
        onKeyDown={handleKeyDown}
        allowClear
        className={config.inputClassName}
      />

      {isDropdownOpen && trimmed && (
        <div
          className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="Search results"
        >
          {loading ? (
            <div id={statusId} className="flex justify-center py-4">
              <TyphoonSpinner size="small" />
            </div>
          ) : filtered.length === 0 ? (
            <div id={statusId} className="px-4 py-3 text-sm text-muted">
              No results found
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto">
                {filtered.slice(0, 5).map((name) => (
                  <Link
                    key={name}
                    href={`/info/${encodeURIComponent(name.toLowerCase())}/`}
                    onClick={handleLinkClick}
                    aria-label={`View details for ${name}`}
                    role="option"
                    aria-selected={false}
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors hover:bg-blue-50"
                  >
                    <span className="text-sm text-muted">
                      <HighlightedName name={name} query={trimmed} />
                    </span>
                  </Link>
                ))}
              </div>
              <button
                onClick={handleViewAll}
                aria-label="View all search results"
                className="w-full cursor-pointer px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                View all results{filtered.length > 5 ? ` (${filtered.length})` : ""}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
