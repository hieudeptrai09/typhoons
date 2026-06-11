import { useMemo } from "react";
import { Table } from "antd";
import { TEXT_COLOR_WHITE_BACKGROUND, COUNTRY_FLAG_COMPONENTS } from "../../../../../constants";
import { getIntensityFromNumber, calculateAverage, getGroupedStorms } from "../../_utils/fns";
import SpecialButtons from "../_components/SpecialButtons";
import StormGrid from "../_components/StormGrid";
import type { Storm, DashboardParams } from "../../../../../types";
import type { ColumnsType } from "antd/es/table";

interface AverageViewProps {
  params: DashboardParams;
  stormsData: Storm[];
  averageValues: Record<number, number> | null;
  onCellClick: (data: number | string, key: string) => void;
}

interface AverageData {
  year?: number;
  country?: string;
  name?: string;
  position?: number;
  count: number;
  average: string;
  avgNumber: number;
}

const transformData = (dataMap: Record<string, Storm[]>, filterType: string): AverageData[] =>
  Object.entries(dataMap).map(([key, storms]) => {
    const avgValue = calculateAverage(storms);
    const base = { count: storms.length, average: avgValue.toFixed(2), avgNumber: avgValue };
    const extras: Record<string, Partial<AverageData>> = {
      year: { year: parseInt(key) },
      country: { country: key },
      name: { name: key, country: storms[0].country, position: storms[0].position },
      position: { position: parseInt(key), country: storms[0].country },
    };
    return { ...extras[filterType], ...base } as AverageData;
  });

const makeColumns = (filterType: string): ColumnsType<AverageData> => {
  const cols: ColumnsType<AverageData> = [
    {
      title: "#",
      key: "order",
      width: 52,
      render: (_: unknown, __: AverageData, index: number) => (
        <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
      ),
    },
  ];

  if (filterType === "year") {
    cols.push({
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => (a.year ?? 0) - (b.year ?? 0),
    });
  }
  if (filterType === "position") {
    cols.push({
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => (a.position ?? 0) - (b.position ?? 0),
    });
  }
  if (filterType === "name") {
    cols.push({
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
    });
  }
  if (filterType !== "year") {
    cols.push({
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => (a.country ?? "").localeCompare(b.country ?? ""),
      render: (_: unknown, row: AverageData) => {
        const FlagComponent = COUNTRY_FLAG_COMPONENTS[String(row.country ?? "")];
        return FlagComponent ? (
          <div
            className="h-7 w-10 overflow-hidden rounded border border-gray-300 shadow-sm"
            title={String(row.country)}
          >
            <FlagComponent className="h-full w-full object-cover" />
          </div>
        ) : (
          <span>{String(row.country)}</span>
        );
      },
    });
  }

  cols.push({
    title: "Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  });
  cols.push({
    title: "Average Intensity",
    dataIndex: "average",
    key: "average",
    sorter: (a, b) => a.avgNumber - b.avgNumber,
    render: (_: unknown, row: AverageData) => {
      const textColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(row.avgNumber)];
      return (
        <span className="font-semibold" style={{ color: textColor }}>
          {row.average}
        </span>
      );
    },
  });

  return cols;
};

const AverageView = ({ params, stormsData, averageValues, onCellClick }: AverageViewProps) => {
  const groupedStorms = useMemo(() => {
    const filtered =
      params.filter === "year"
        ? stormsData.filter((s) => parseInt(s.year.toString()) >= 2000)
        : stormsData;
    return getGroupedStorms(filtered, params.filter);
  }, [stormsData, params.filter]);

  if (params.mode === "table") {
    return (
      <div>
        <SpecialButtons onCellClick={onCellClick} isAverageView averageValues={averageValues} />
        <StormGrid
          viewType="average"
          onCellClick={onCellClick}
          stormsData={stormsData}
          averageValues={averageValues}
          isClickable
        />
      </div>
    );
  }

  const data = transformData(groupedStorms, params.filter);

  return (
    <div className="mx-auto max-w-3xl">
      <Table<AverageData>
        dataSource={data}
        columns={makeColumns(params.filter)}
        rowKey={(r) => String(r.year ?? r.country ?? r.name ?? r.position ?? Math.random())}
        onRow={(row) => ({
          onClick: () => {
            const value = row[params.filter as keyof AverageData];
            if (value !== undefined) onCellClick(value as number | string, params.filter);
          },
        })}
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

export default AverageView;
