import { useMemo } from "react";
import { Table } from "antd";
import { Flame, Skull } from "lucide-react";
import { getNameStatusColorClass } from "../../../../../components/colors";
import EmptyResults from "../../../../../components/components/EmptyResults";
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
    const cols: ColumnsType<TyphoonName> = [
      {
        title: "#",
        key: "order",
        width: 52,
        fixed: "left" as const,
        render: (_: unknown, __: TyphoonName, index: number) => (
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
        render: (_: unknown, record: TyphoonName) => (
          <span className={`font-semibold ${getNameStatusColorClass(record)}`}>{record.name}</span>
        ),
      },
      {
        title: "Retired",
        dataIndex: "isRetired",
        key: "isRetired",
        sorter: (a, b) => Number(a.isRetired) - Number(b.isRetired),
        render: (_: unknown, record: TyphoonName) =>
          record.isRetired ? (
            <Skull className={getNameStatusColorClass(record)} size={20} />
          ) : (
            <Flame className={getNameStatusColorClass(record)} size={20} />
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
        render: (_: unknown, record: TyphoonName) => (
          <span className="block max-w-[200px] wrap-break-word whitespace-normal text-gray-700">
            {record.meaning || "-"}
          </span>
        ),
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
            <span className="block max-w-[300px] wrap-break-word whitespace-normal text-gray-700">
              {record.description || "-"}
            </span>
          ),
        },
      );
    }

    return cols;
  }, [showImageAndDescription]);

  if (filteredNames.length === 0) {
    return <EmptyResults />;
  }

  return (
    <div
      className={`mx-auto ${showImageAndDescription ? "max-w-8xl" : "max-w-4xl"} overflow-x-auto pb-px`}
    >
      <Table<TyphoonName>
        dataSource={filteredNames}
        columns={tableColumns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onNameClick(record),
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
  );
};

export default FilteredNamesTable;
