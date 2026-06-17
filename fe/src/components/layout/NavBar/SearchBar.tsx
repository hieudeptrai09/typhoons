"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Spin } from "antd";
import { Search } from "lucide-react";
import CountryFlag from "../../components/CountryFlag";
import SearchResultModal from "./SearchResultModal";
import type { SearchResult } from "../../../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      setResults(json.data ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsDropdownOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
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

  const handleSelect = (result: SearchResult) => {
    setSelectedNameId(result.id);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
    setQuery("");
  };

  const getStatusBadge = (result: SearchResult) => {
    if (!result.isRetired) {
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Active
        </span>
      );
    }
    const label =
      result.isLanguageProblem === 1
        ? "Language"
        : result.isLanguageProblem === 2
          ? "Misspelling"
          : result.isLanguageProblem === 3
            ? "Special"
            : "Retired";
    const colorClass =
      result.isLanguageProblem === 1
        ? "bg-green-100 text-green-700"
        : result.isLanguageProblem === 2
          ? "bg-amber-100 text-amber-700"
          : result.isLanguageProblem === 3
            ? "bg-purple-100 text-purple-700"
            : "bg-red-100 text-red-700";
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>{label}</span>
    );
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <Input
          prefix={<Search size={16} className="text-white/70" />}
          placeholder="Search names..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.trim() && setIsDropdownOpen(true)}
          allowClear
          className="search-bar-input"
          style={{ width: 200 }}
          styles={{
            input: {
              backgroundColor: "transparent",
              color: "white",
              caretColor: "white",
            },
            affixWrapper: {
              backgroundColor: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
            },
          }}
        />

        {isDropdownOpen && query.trim() && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 min-w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {loading ? (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
            ) : (
              results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-blue-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{result.name}</span>
                      {getStatusBadge(result)}
                      {result.stormCount > 0 && (
                        <span className="text-xs text-gray-400">x{result.stormCount}</span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <CountryFlag country={result.country} className="h-3.5 w-5" />
                      <span>{result.country}</span>
                      {result.position >= 1 && result.position <= 140 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>#{result.position}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedNameId !== null && (
        <SearchResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNameId(null);
          }}
          nameId={selectedNameId}
        />
      )}
    </>
  );
};

export default SearchBar;
