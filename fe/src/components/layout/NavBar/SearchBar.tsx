"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import HighlightedName from "../../components/HighlightedName";
import TyphoonSpinner from "../../components/TyphoonSpinner";
import type { SearchResult } from "../../../types";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: results, loading } = useFetchData<SearchResult[]>(
    debouncedQuery ? `/search?q=${encodeURIComponent(debouncedQuery)}` : "",
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsDropdownOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value.trim()), 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
    setDebouncedQuery("");
  };

  const handleViewAll = () => {
    const q = query.trim();
    setIsDropdownOpen(false);
    setQuery("");
    setDebouncedQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && query.trim()) {
      handleViewAll();
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        <Input
          prefix={<Search size={16} className="text-white/70" />}
          placeholder="Search names..."
          aria-label="Search typhoon names"
          aria-describedby={isDropdownOpen && query.trim() ? "search-status" : undefined}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.trim() && setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          allowClear
          className="search-bar-input w-full"
          style={{ width: "100%" }}
          styles={{
            input: {
              backgroundColor: "transparent",
              color: "white",
              caretColor: "white",
            },
            root: {
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
            },
          }}
        />

        {isDropdownOpen && query.trim() && (
          <div
            className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            role="listbox"
            aria-label="Search results"
          >
            {loading ? (
              <div id="search-status" className="flex justify-center py-4">
                <TyphoonSpinner size="small" />
              </div>
            ) : !results || results.length === 0 ? (
              <div id="search-status" className="px-4 py-3 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto">
                  {results.slice(0, 5).map((result) => (
                    <Link
                      key={result.id ?? `storm-${result.name}`}
                      href={`/info/${encodeURIComponent(result.name.toLowerCase())}/`}
                      onClick={handleLinkClick}
                      aria-label={`View details for ${result.name}`}
                      role="option"
                      aria-selected={false}
                      className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors hover:bg-blue-50"
                    >
                      <span className="text-sm text-gray-900">
                        <HighlightedName name={result.name} query={query.trim()} />
                      </span>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleViewAll}
                  aria-label="View all search results"
                  className="w-full cursor-pointer px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  View all results{results.length > 5 ? ` (${results.length})` : ""}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
