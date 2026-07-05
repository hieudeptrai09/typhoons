"use client";

import { Input } from "antd";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="mb-4 w-full max-w-sm">
      <Input
        size="large"
        placeholder="Search typhoon names..."
        aria-label="Search typhoon names"
        aria-describedby="home-search-description"
        prefix={<Search size={18} className="text-gray-400" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={handleSearch}
        allowClear
        className="home-search-input"
      />
    </div>
  );
};

export default SearchBar;
