"use client";

import { useScrollEndFade } from "@/lib/hooks/useScrollEndFade";
import type { TableProps } from "antd";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./styles.css";

interface DefTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: TableProps<T>["rowKey"];
  onRow?: TableProps<T>["onRow"];
  rowClickable?: (record: T, index: number) => boolean;
  maxWidth: string;
  tableKey?: React.Key;
}

const DefTable = <T extends object>({
  columns,
  dataSource,
  rowKey,
  onRow,
  rowClickable,
  maxWidth,
  tableKey,
}: DefTableProps<T>) => {
  const { wrapperRef, showEndFade } = useScrollEndFade();

  const isRowClickable = rowClickable ?? (() => Boolean(onRow));

  return (
    <div className={`mx-auto ${maxWidth}`}>
      <div ref={wrapperRef} className="relative">
        <Table<T>
          key={tableKey}
          dataSource={dataSource}
          columns={columns}
          rowKey={rowKey}
          onRow={onRow}
          rowClassName={(record, index) =>
            `${isRowClickable(record, index) ? "cursor-pointer" : "cursor-default"} ${
              index % 2 === 0 ? "bg-white" : "bg-sky-100"
            }`
          }
          pagination={false}
          size="large"
          className="typhoon-table"
          scroll={{ x: "max-content" }}
          sticky
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-stone-100 to-transparent transition-opacity duration-200 md:hidden ${
            showEndFade ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default DefTable;
