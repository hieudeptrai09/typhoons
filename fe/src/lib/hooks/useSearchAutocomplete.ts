"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFetchData } from "./useFetchData";

export function useSearchAutocomplete() {
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

  return {
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
  };
}
