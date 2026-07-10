import EmptyResults from "@/lib/components/EmptyResults";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import NameStatusIcon from "@/lib/components/NameStatusIcon";
import TableScrollHint from "@/lib/components/TableScrollHint";
import type { TyphoonName } from "@/lib/types";
import { clickableRowProps } from "@/lib/utils/a11y";
import { getNameStatusColorClass } from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

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
        render: (_: unknown, record: TyphoonName) => (
          <NameStatusIcon
            isRetired={record.isRetired}
            isLanguageProblem={record.isLanguageProblem}
            size={20}
          />
        ),
      },
      {
        title: "Contributed By",
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
          <span className="block max-w-[200px] wrap-break-word whitespace-normal">
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
              <span>-</span>
            ),
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
          render: (_: unknown, record: TyphoonName) => (
            <span className="block max-w-[300px] wrap-break-word whitespace-normal">
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
    <div className={`mx-auto ${showImageAndDescription ? "max-w-8xl" : "max-w-4xl"}`}>
      <TableScrollHint>
        <Table<TyphoonName>
          dataSource={filteredNames}
          columns={tableColumns}
          rowKey="id"
          onRow={(record) =>
            clickableRowProps(`View details for ${record.name}`, () => onNameClick(record))
          }
          rowClassName={(_record, index) =>
            `cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-sky-100"}`
          }
          pagination={false}
          size="large"
          className="typhoon-table"
          scroll={{ x: "max-content" }}
          sticky
        />
      </TableScrollHint>
    </div>
  );
};

export default FilteredNamesTable;
