import { useMemo } from "react";
import { Table } from "antd";
import { Flame, Skull } from "lucide-react";
import EmptyResults from "../../../../components/components/EmptyResults";
import ImageWithLoader from "../../../../components/components/ImageWithLoader";
import { getPositionTitle } from "../../../../containers/utils/fns";
import type { RetiredName } from "../../../../types";
import type { ColumnsType } from "antd/es/table";

interface NamesListTableProps {
  names: RetiredName[];
  showRetiredColumns: boolean;
  showImageAndDescription: boolean;
  onNameClick: (name: RetiredName) => void;
}

const getNameColor = (row: RetiredName): string => {
  if (row.isLanguageProblem === 2) return "text-amber-500";
  if (Boolean(row.isRetired)) return "text-red-600";
  return "text-green-700";
};

const NamesListTable = ({
  names,
  showRetiredColumns,
  showImageAndDescription,
  onNameClick,
}: NamesListTableProps) => {
  const columns = useMemo<ColumnsType<RetiredName>>(() => {
    const cols: ColumnsType<RetiredName> = [
      {
        title: "#",
        key: "order",
        width: 52,
        render: (_: unknown, __: RetiredName, index: number) => (
          <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "isRetired",
        key: "isRetired",
        sorter: (a, b) => Number(a.isRetired) - Number(b.isRetired),
        render: (_: unknown, record: RetiredName) =>
          record.isRetired ? (
            <Skull className={getNameColor(record)} size={20} />
          ) : (
            <Flame className="text-green-700" size={20} />
          ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_: unknown, record: RetiredName) => (
          <span className={`font-semibold ${getNameColor(record)}`}>{record.name}</span>
        ),
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        sorter: (a, b) => a.country.localeCompare(b.country),
      },
      {
        title: "Language",
        dataIndex: "language",
        key: "language",
        sorter: (a, b) => (a.language ?? "").localeCompare(b.language ?? ""),
      },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        sorter: (a, b) => a.position - b.position,
        render: (_: unknown, record: RetiredName) => (
          <span>{getPositionTitle(record.position)}</span>
        ),
      },
      {
        title: "Meaning",
        dataIndex: "meaning",
        key: "meaning",
      },
    ];

    if (showRetiredColumns) {
      cols.push(
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          render: (_: unknown, record: RetiredName) => (
            <span className="text-gray-700">{record.note || "-"}</span>
          ),
        },
        {
          title: "Year of Last Storm",
          dataIndex: "lastYear",
          key: "lastYear",
          sorter: (a, b) => a.lastYear - b.lastYear,
          render: (_: unknown, record: RetiredName) => <span>{record.lastYear || "-"}</span>,
        },
      );
    }

    if (showImageAndDescription) {
      cols.push(
        {
          title: "Image",
          dataIndex: "image",
          key: "image",
          render: (_: unknown, record: RetiredName) =>
            record.image ? (
              <div className="relative h-28 rounded-lg" style={{ aspectRatio: "4/3" }}>
                <ImageWithLoader
                  src={record.image}
                  alt={record.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-gray-700">-</span>
            ),
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
          render: (_: unknown, record: RetiredName) => (
            <span className="text-gray-700">{record.description || "-"}</span>
          ),
        },
      );
    }

    return cols;
  }, [showRetiredColumns, showImageAndDescription]);

  if (names.length === 0) {
    return <EmptyResults />;
  }

  const wide = showImageAndDescription || showRetiredColumns;

  return (
    <div className={`mx-auto ${wide ? "max-w-8xl" : "max-w-4xl"} overflow-x-auto pb-px`}>
      <Table<RetiredName>
        dataSource={names}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onNameClick(record) })}
        rowClassName={(_record, index) =>
          `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
        }
        pagination={false}
        size="large"
        className="typhoon-table"
      />
    </div>
  );
};

export default NamesListTable;
