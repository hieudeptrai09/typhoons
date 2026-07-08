"use client";

import HighlightedName from "@/lib/components/HighlightedName";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { useSearchAutocomplete } from "@/lib/hooks/useSearchAutocomplete";
import { Input } from "antd";
import { Search } from "lucide-react";
import Link from "next/link";

const SearchBar = () => {
  const {
    query,
    setQuery,
    isDropdownOpen,
    setIsDropdownOpen,
    containerRef,
    trimmed,
    filtered,
    loading,
    handleLinkClick,
    handleViewAll,
    handleKeyDown,
  } = useSearchAutocomplete();

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        <Input
          prefix={<Search size={16} className="text-white" />}
          placeholder="Search names..."
          aria-label="Search typhoon names"
          aria-describedby={isDropdownOpen && trimmed ? "search-status" : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => trimmed && setIsDropdownOpen(true)}
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

        {isDropdownOpen && trimmed && (
          <div
            className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            role="listbox"
            aria-label="Search results"
          >
            {loading ? (
              <div id="search-status" className="flex justify-center py-4">
                <TyphoonSpinner size="small" />
              </div>
            ) : filtered.length === 0 ? (
              <div id="search-status" className="px-4 py-3 text-sm text-gray-500">
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
                      <span className="text-sm text-gray-900">
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
    </>
  );
};

export default SearchBar;
