"use client";

import { useState, useMemo } from "react";
import { Table } from "antd";
import TyphoonSpinner from "../../../components/components/TyphoonSpinner";
import { Flame, Skull } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getNameStatusColorClass } from "../../../components/colors";
import CountryFlag from "../../../components/components/CountryFlag";
import EmptyResults from "../../../components/components/EmptyResults";
import FrownNotFound from "../../../components/components/FrownNotFound";
import HighlightedName from "../../../components/components/HighlightedName";
import PageHeader from "../../../components/components/PageHeader";
import SearchResultModal from "../../../components/ui/SearchResultModal";
import { useFetchData } from "../../../containers/hooks/useFetchData";
import type { SearchResult } from "../../../types";
import type { ColumnsType } from "antd/es/table";

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
    render: (_: unknown, record: SearchResult) => {
      const status = { ...record, isRetired: Boolean(record.isRetired) };
      return record.isRetired ? (
        <Skull className={getNameStatusColorClass(status)} size={20} />
      ) : (
        <Flame className={getNameStatusColorClass(status)} size={20} />
      );
    },
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
    render: (note: string | null) =>
      note ? (
        <span className="block max-w-[300px] wrap-break-word whitespace-normal text-gray-700">
          {note}
        </span>
      ) : null,
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
            <TyphoonSpinner size="large" />
          </div>
        ) : !query.trim() ? (
          <div className="py-12 text-center text-gray-400">Type a name to search</div>
        ) : !results || results.length === 0 ? (
          <EmptyResults />
        ) : (
          <>
            <div id="search-result-count" className="mb-4 text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
            <div className="overflow-x-auto pb-px" aria-describedby="search-result-count">
              <Table<SearchResult>
                dataSource={results}
                columns={columns}
                rowKey={(record) =>
                  record.id !== null ? String(record.id) : `storm-${record.name}`
                }
                onRow={(record) => ({
                  onClick: () => handleNameClick(record),
                  "aria-label": `View details for ${record.name}`,
                  role: "button",
                  tabIndex: 0,
                })}
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
