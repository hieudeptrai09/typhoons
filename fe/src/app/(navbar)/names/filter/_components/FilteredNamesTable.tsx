import { useMemo } from "react";
import { Table } from "antd";
import { Flame, Skull } from "lucide-react";
import FrownNotFound from "../../../../../components/components/FrownNotFound";
import ImageWithLoader from "../../../../../components/components/ImageWithLoader";
import { getPositionTitle } from "../../../../../containers/utils/fns";
import type { TyphoonName } from "../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface FilteredNamesTableProps {
  filteredNames: TyphoonName[];
  showImageAndDescription: boolean;
  onNameClick: (name: TyphoonName) => void;
}

const FilteredNamesTable = ({
  filteredNames,
  showImageAndDescription,
  onNameClick,
}: FilteredNamesTableProps) => {
  const tableColumns = useMemo<ColumnsType<TyphoonName>>(() => {
    const getNameColor = (row: TyphoonName): string => {
      if (row.isLanguageProblem === 2) return "text-amber-500";
      if (Boolean(row.isRetired)) return "text-red-600";
      return "text-green-700";
    };

    const getRetiredColor = (row: TyphoonName): string => {
      if (!row.isRetired) return "text-green-700";
      if (row.isLanguageProblem === 2) return "text-amber-500";
      return "text-red-600";
    };

    const cols: ColumnsType<TyphoonName> = [
      {
        title: "#",
        key: "order",
        width: 52,
        render: (_: unknown, __: TyphoonName, index: number) => (
          <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
        ),
      },
      {
        title: "Retired",
        dataIndex: "isRetired",
        key: "isRetired",
        sorter: (a, b) => Number(a.isRetired) - Number(b.isRetired),
        render: (_: unknown, record: TyphoonName) =>
          record.isRetired ? (
            <Skull className={getRetiredColor(record)} size={20} />
          ) : (
            <Flame className="text-green-700" size={20} />
          ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_: unknown, record: TyphoonName) => (
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
        render: (_: unknown, record: TyphoonName) => (
          <span>{getPositionTitle(record.position)}</span>
        ),
      },
      {
        title: "Meaning",
        dataIndex: "meaning",
        key: "meaning",
      },
    ];

    if (showImageAndDescription) {
      cols.push(
        {
          title: "Image",
          dataIndex: "image",
          key: "image",
          render: (_: unknown, record: TyphoonName) =>
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
          render: (_: unknown, record: TyphoonName) => (
            <span className="text-gray-700">{record.description || "-"}</span>
          ),
        },
      );
    }

    return cols;
  }, [showImageAndDescription]);

  if (filteredNames.length === 0) {
    return <FrownNotFound />;
  }

  return (
    <div className={`mx-auto ${showImageAndDescription ? "max-w-8xl" : "max-w-4xl"}`}>
      <Table<TyphoonName>
        dataSource={filteredNames}
        columns={tableColumns}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onNameClick(record) })}
        rowClassName={(_record, index) =>
          `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
        }
        pagination={false}
        size="large"
        className="typhoon-table"
        scroll={undefined}
      />
    </div>
  );
};

export default FilteredNamesTable;
