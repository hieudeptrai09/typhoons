"use client";

import { useScrollEndFade } from "@/lib/hooks/useScrollEndFade";
import type { TableProps } from "antd";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: TableProps<T>["rowKey"];
  onRow?: TableProps<T>["onRow"];
  /**
   * Whether a given row is clickable, controlling its cursor. Defaults to
   * "clickable when an `onRow` handler is provided". Pass a predicate to make
   * clickability depend on the row (e.g. only months that contain storms).
   */
  rowClickable?: (record: T, index: number) => boolean;
  /** Tailwind max-width applied to the centered wrapper (e.g. "max-w-2xl"). */
  maxWidth: string;
  /** Forwarded to the antd table `key` to force a remount (e.g. on filter change). */
  tableKey?: React.Key;
}

/**
 * Shared antd table wrapper: applies the project's table styling, zebra
 * striping, sticky header, horizontal-scroll fade, and centered max-width
 * layout so call sites only supply their columns, data, and row behavior.
 */
const DataTable = <T extends object>({
  columns,
  dataSource,
  rowKey,
  onRow,
  rowClickable,
  maxWidth,
  tableKey,
}: DataTableProps<T>) => {
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

export default DataTable;
