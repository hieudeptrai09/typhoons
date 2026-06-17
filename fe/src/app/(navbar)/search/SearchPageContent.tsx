"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input, Spin, Table } from "antd";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import CountryFlag from "../../../components/components/CountryFlag";
import EmptyResults from "../../../components/components/EmptyResults";
import FrownNotFound from "../../../components/components/FrownNotFound";
import PageHeader from "../../../components/components/PageHeader";
import SearchResultModal from "../../../components/ui/SearchResultModal";
import { getPositionTitle } from "../../../containers/utils/fns";
import type { SearchResult } from "../../../types";
import type { ColumnsType } from "antd/es/table";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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

const getNameColor = (result: SearchResult): string => {
  if (!result.isRetired) return "text-blue-600";
  switch (result.isLanguageProblem) {
    case 1:
      return "text-green-600";
    case 2:
      return "text-amber-500";
    case 3:
      return "text-purple-600";
    default:
      return "text-red-600";
  }
};

const columns: ColumnsType<SearchResult> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, record: SearchResult) => (
      <span className={`font-semibold ${getNameColor(record)}`}>{record.name}</span>
    ),
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
    sorter: (a, b) => a.position - b.position,
    render: (_: unknown, record: SearchResult) => (
      <span>{getPositionTitle(record.position)}</span>
    ),
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_: unknown, record: SearchResult) => (
      <div className="flex items-center gap-2">
        <CountryFlag country={record.country} className="h-5 w-8" />
        <span>{record.country}</span>
      </div>
    ),
  },
  {
    title: "Status",
    key: "status",
    sorter: (a, b) => Number(a.isRetired) - Number(b.isRetired),
    render: (_: unknown, record: SearchResult) => getStatusBadge(record),
  },
];

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      setResults(json.data ?? []);
      setHasSearched(true);
    } catch {
      setResults([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery, fetchResults]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search", {
        scroll: false,
      });
      fetchResults(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleNameClick = (record: SearchResult) => {
    setSelectedNameId(record.id);
    setIsModalOpen(true);
  };

  if (error) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title="Search Typhoon Names">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Input
            prefix={<Search size={18} className="text-gray-400" />}
            placeholder="Search by name..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            allowClear
            size="large"
            autoFocus
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : !hasSearched ? (
          <div className="py-12 text-center text-gray-400">
            Type a name to search
          </div>
        ) : results.length === 0 ? (
          <EmptyResults />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
            <div className="overflow-x-auto pb-px">
              <Table<SearchResult>
                dataSource={results}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({ onClick: () => handleNameClick(record) })}
                rowClassName={(_record, index) =>
                  `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
                }
                pagination={false}
                size="large"
                className="typhoon-table"
                scroll={undefined}
              />
            </div>
          </>
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
    </PageHeader>
  );
}
