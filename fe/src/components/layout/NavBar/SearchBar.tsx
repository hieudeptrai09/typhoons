"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Input, Spin } from "antd";
import { Search } from "lucide-react";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import CountryFlag from "../../components/CountryFlag";
import SearchResultModal from "./SearchResultModal";
import type { TyphoonName, RetiredName } from "../../../types";

type AllName = TyphoonName | RetiredName;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<AllName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: activeNames, loading: activeLoading } =
    useFetchData<TyphoonName[]>("/typhoon-names?isRetired=0");
  const { data: retiredNames, loading: retiredLoading } =
    useFetchData<RetiredName[]>("/typhoon-names?isRetired=1");

  const loading = activeLoading || retiredLoading;

  const allNames: AllName[] = useMemo(() => {
    return [...(activeNames ?? []), ...(retiredNames ?? [])];
  }, [activeNames, retiredNames]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allNames
      .filter((n) => n.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(q);
        const bStartsWith = b.name.toLowerCase().startsWith(q);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 50);
  }, [allNames, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (name: AllName) => {
    setSelectedName(name);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
    setQuery("");
  };

  const getStatusBadge = (name: AllName) => {
    if (!name.isRetired) {
      return (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Active
        </span>
      );
    }
    const label =
      name.isLanguageProblem === 1
        ? "Language"
        : name.isLanguageProblem === 2
          ? "Misspelling"
          : name.isLanguageProblem === 3
            ? "Special"
            : "Retired";
    const colorClass =
      name.isLanguageProblem === 1
        ? "bg-green-100 text-green-700"
        : name.isLanguageProblem === 2
          ? "bg-amber-100 text-amber-700"
          : name.isLanguageProblem === 3
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
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
            ) : filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
            ) : (
              filtered.map((name) => (
                <button
                  key={`${name.id}-${name.isRetired ? "r" : "a"}`}
                  onClick={() => handleSelect(name)}
                  className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-blue-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{name.name}</span>
                      {getStatusBadge(name)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <CountryFlag country={name.country} className="h-3.5 w-5" />
                      <span>{name.country}</span>
                      {name.position >= 1 && name.position <= 140 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>#{name.position}</span>
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

      {selectedName && (
        <SearchResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedName(null);
          }}
          name={selectedName}
        />
      )}
    </>
  );
};

export default SearchBar;
