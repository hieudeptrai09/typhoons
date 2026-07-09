import CountryFlag from "@/lib/components/CountryFlag";
import type { DashboardParams, Storm } from "@/lib/types";
import { clickableRowProps } from "@/lib/utils/a11y";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import SpecialButtons from "../_widgets/SpecialButtons";
import SpecialNamesListDiv from "../_widgets/SpecialNamesListDiv";
import StormGrid from "../_widgets/StormGrid";
import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  SPECIAL_POSITIONS,
} from "../../_utils/fns";
import SeasonView from "./SeasonView";

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

    switch (filterType) {
      case "year":
        return { year: parseInt(key), ...base };
      case "country":
        return { country: key, ...base };
      case "name":
        return {
          name: key,
          country: storms[0].country,
          position: storms[0].position,
          ...base,
        };
      case "position":
      default:
        return {
          position: parseInt(key),
          country: storms[0].country,
          ...base,
        };
    }
  });

const AvgIntensityCell = ({ avgNumber, average }: { avgNumber: number; average: string }) => {
  const textColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avgNumber)];
  return (
    <span className="font-semibold" style={{ color: textColor }}>
      {average}
    </span>
  );
};

const makeColumns = (filterType: string): ColumnsType<AverageData> => {
  const orderCol: ColumnsType<AverageData>[number] = {
    title: "#",
    key: "order",
    width: 52,
    fixed: "left" as const,
    render: (_: unknown, __: AverageData, index: number) => (
      <span className="text-sm font-semibold text-sky-700">{index + 1}</span>
    ),
  };

  const countCol: ColumnsType<AverageData>[number] = {
    title: "Count",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count - b.count,
  };

  const avgCol: ColumnsType<AverageData>[number] = {
    title: "Average Intensity",
    dataIndex: "average",
    key: "average",
    sorter: (a, b) => a.avgNumber - b.avgNumber,
    render: (_: unknown, row: AverageData) => (
      <AvgIntensityCell avgNumber={row.avgNumber} average={row.average} />
    ),
  };

  const countryCol: ColumnsType<AverageData>[number] = {
    title: "Country",
    dataIndex: "country",
    key: "country",
    sorter: (a, b) => (a.country ?? "").localeCompare(b.country ?? ""),
    render: (_: unknown, row: AverageData) => <CountryFlag country={row.country ?? ""} />,
  };

  switch (filterType) {
    case "year":
      return [
        orderCol,
        {
          title: "Year",
          dataIndex: "year",
          key: "year",
          width: 80,
          fixed: "left" as const,
          sorter: (a, b) => (a.year ?? 0) - (b.year ?? 0),
        },
        countCol,
        avgCol,
      ];

    case "country":
      return [
        orderCol,
        {
          title: "Country",
          dataIndex: "country",
          key: "country",
          width: 120,
          fixed: "left" as const,
          sorter: (a, b) => (a.country ?? "").localeCompare(b.country ?? ""),
          render: (_: unknown, row: AverageData) => <CountryFlag country={row.country ?? ""} />,
        },
        countCol,
        avgCol,
      ];

    case "name":
      return [
        orderCol,
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          width: 100,
          fixed: "left" as const,
          sorter: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
          render: (_: unknown, row: AverageData) => (
            <span className="font-semibold">{row.name}</span>
          ),
        },
        countryCol,
        countCol,
        {
          title: "Position",
          dataIndex: "position",
          key: "position",
          sorter: (a, b) => (a.position ?? 0) - (b.position ?? 0),
          render: (_: unknown, row: AverageData) => (
            <span>{row.position !== undefined ? getPositionTitle(row.position) : ""}</span>
          ),
        },
        avgCol,
      ];

    case "position":
    default:
      return [
        orderCol,
        {
          title: "Position",
          dataIndex: "position",
          key: "position",
          width: 100,
          fixed: "left" as const,
          sorter: (a, b) => (a.position ?? 0) - (b.position ?? 0),
          render: (_: unknown, row: AverageData) => (
            <span>{row.position !== undefined ? getPositionTitle(row.position) : ""}</span>
          ),
        },
        countryCol,
        countCol,
        avgCol,
      ];
  }
};

const AverageView = ({ params, stormsData, averageValues, onCellClick }: AverageViewProps) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const groupedStorms = useMemo(() => {
    const filtered =
      params.filter === "year"
        ? stormsData.filter((s) => parseInt(s.year.toString()) >= 2000)
        : stormsData;
    return getGroupedStorms(filtered, params.filter);
  }, [stormsData, params.filter]);

  const nameAverageValues = useMemo<Record<string, number> | null>(() => {
    if (params.filter !== "name") return null;
    const result: Record<string, number> = {};
    Object.entries(groupedStorms).forEach(([name, storms]) => {
      result[name] = calculateAverage(storms);
    });
    return result;
  }, [groupedStorms, params.filter]);

  // Average / name / table → names grid + special names list
  if (params.filter === "name" && params.mode === "table") {
    return (
      <div className="flex flex-col gap-6">
        <StormGrid
          viewType="names"
          stormsData={stormsData}
          onCellClick={onCellClick}
          nameAverageValues={nameAverageValues ?? undefined}
        />
        <SpecialNamesListDiv
          stormsData={stormsData}
          nameAverageValues={nameAverageValues ?? undefined}
          onNameClick={(name) => onCellClick(name, "name")}
        />
      </div>
    );
  }

  // Average / year / table → year highlights grid + read-only special regions
  if (params.filter === "year" && params.mode === "table") {
    const specialPositions = SPECIAL_POSITIONS.map(({ id, label }) => {
      const years = new Set(stormsData.filter((s) => s.position === id).map((s) => s.year));
      return { id, label, years };
    });

    return (
      <div>
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <div className="mr-2 self-start pt-2 text-sm font-semibold text-gray-700">
            Other Regions:
          </div>
          {specialPositions.map(({ id, label, years }) => {
            const isHighlighted = hoveredYear !== null && years.has(hoveredYear);
            return (
              <div
                key={id}
                className={`cursor-default rounded border px-4 py-2 text-sm font-semibold transition-colors ${
                  isHighlighted
                    ? "border-stone-400 bg-stone-200 text-gray-700"
                    : "border-stone-300 text-gray-500"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
        <StormGrid
          viewType="yearHighlights"
          stormsData={stormsData}
          onCellClick={onCellClick}
          onYearHover={setHoveredYear}
        />
      </div>
    );
  }

  // Average / position / table → classic StormGrid
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

  // Average / month / list → SeasonView
  if (params.filter === "month") {
    return <SeasonView stormsData={stormsData} onCellClick={onCellClick} />;
  }

  // List modes (position / name / country / year)
  const data = transformData(groupedStorms, params.filter);

  const widthClass: Record<string, string> = {
    position: "max-w-2xl",
    name: "max-w-2xl",
    country: "max-w-lg",
    year: "max-w-lg",
  };

  return (
    <div className={`mx-auto ${widthClass[params.filter] ?? "max-w-2xl"} overflow-x-auto pb-px`}>
      <Table<AverageData>
        key={params.filter}
        dataSource={data}
        columns={makeColumns(params.filter)}
        rowKey={(row) => {
          switch (params.filter) {
            case "year":
              return String(row.year);
            case "country":
              return row.country ?? "";
            case "name":
              return `${row.name}-${row.country}`;
            case "position":
              return String(row.position);
            default:
              return String(Math.random());
          }
        }}
        onRow={(row) => {
          const value = row[params.filter as keyof AverageData];
          if (value === undefined) return {};
          return clickableRowProps(`View details for ${value}`, () =>
            onCellClick(value as number | string, params.filter),
          );
        }}
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

export default AverageView;
