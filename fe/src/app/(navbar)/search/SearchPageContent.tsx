"use client";

import { useState, useMemo } from "react";
import { Spin, Table } from "antd";
import { useSearchParams } from "next/navigation";
import CountryFlag from "../../../components/components/CountryFlag";
import EmptyResults from "../../../components/components/EmptyResults";
import FrownNotFound from "../../../components/components/FrownNotFound";
import HighlightedName from "../../../components/components/HighlightedName";
import PageHeader from "../../../components/components/PageHeader";
import SearchResultModal from "../../../components/ui/SearchResultModal";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import type { SearchResult } from "../../../types";
import type { ColumnsType } from "antd/es/table";

const getStatusBadge = (result: SearchResult) => {
  if (!result.isRetired) {
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        Active
      </span>
    );
  }
  if (result.isLanguageProblem === 2) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        Misspelling
      </span>
    );
  }
  return (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
      Retired
    </span>
  );
};


const getColumns = (query: string): ColumnsType<SearchResult> => [
  {
    title: "#",
    key: "order",
    width: 52,
    fixed: "left" as const,
    render: (_: unknown, __: SearchResult, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 100,
    fixed: "left" as const,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_: unknown, record: SearchResult) => {
      const color = !record.isRetired
        ? "text-green-600"
        : record.isLanguageProblem === 2
          ? "text-amber-600"
          : "text-red-600";
      return (
        <HighlightedName name={record.name} query={query} className={`font-semibold ${color}`} />
      );
    },
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => a.country.localeCompare(b.country),
    render: (_: unknown, record: SearchResult) => <CountryFlag country={record.country} />,
  },
  {
    title: "Status",
    key: "status",
    sorter: (a, b) => Number(a.isRetired) - Number(b.isRetired),
    render: (_: unknown, record: SearchResult) => getStatusBadge(record),
  },
  {
    title: "Storms",
    dataIndex: "stormCount",
    key: "stormCount",
    sorter: (a, b) => a.stormCount - b.stormCount,
    render: (count: number) => <span>x{count}</span>,
  },
  {
    title: "Replacement",
    dataIndex: "replacementName",
    key: "replacementName",
    render: (name: string | null) => (name ? <span>{name}</span> : null),
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
    render: (note: string | null) => (note ? <span>{note}</span> : null),
  },
];

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const columns = useMemo(() => getColumns(query), [query]);

  const {
    data: results,
    loading,
    error,
  } = useFetchData<SearchResult[]>(
    query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "",
  );

  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);
  const [selectedStormName, setSelectedStormName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameClick = (record: SearchResult) => {
    setSelectedNameId(record.id);
    setSelectedStormName(record.id === null ? record.name : null);
    setIsModalOpen(true);
  };

  if (error) {
    return <FrownNotFound />;
  }

  return (
    <PageHeader title="Search Typhoon Names">
      <div className="mx-auto max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : !query.trim() ? (
          <div className="py-12 text-center text-gray-400">Type a name to search</div>
        ) : !results || results.length === 0 ? (
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
                rowKey={(record) => record.id !== null ? String(record.id) : `storm-${record.name}`}
                onRow={(record) => ({ onClick: () => handleNameClick(record) })}
                rowClassName={(_record, index) =>
                  `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
                }
                pagination={false}
                size="large"
                className="typhoon-table"
                scroll={{ x: "max-content" }}
              />
            </div>
          </>
        )}
      </div>

      {(selectedNameId !== null || selectedStormName !== null) && (
        <SearchResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNameId(null);
            setSelectedStormName(null);
          }}
          nameId={selectedNameId}
          stormName={selectedStormName}
        />
      )}
    </PageHeader>
  );
}
