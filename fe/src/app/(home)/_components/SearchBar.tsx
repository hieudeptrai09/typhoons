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
    <div ref={containerRef} className="relative w-full">
      <Input
        size="large"
        placeholder="Search typhoon names..."
        aria-label="Search typhoon names"
        aria-describedby={
          isDropdownOpen && trimmed ? "home-search-status" : "home-search-description"
        }
        prefix={<Search size={18} className="text-gray-500" />}
        suffix={
          trimmed ? (
            <button
              type="button"
              onClick={handleViewAll}
              aria-label="Search"
              className="flex cursor-pointer items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <Search size={16} />
            </button>
          ) : undefined
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => trimmed && setIsDropdownOpen(true)}
        onKeyDown={handleKeyDown}
        allowClear
        className="home-search-input"
      />

      {isDropdownOpen && trimmed && (
        <div
          className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="Search results"
        >
          {loading ? (
            <div id="home-search-status" className="flex justify-center py-4">
              <TyphoonSpinner size="small" />
            </div>
          ) : filtered.length === 0 ? (
            <div id="home-search-status" className="px-4 py-3 text-sm text-gray-500">
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
  );
};

export default SearchBar;
