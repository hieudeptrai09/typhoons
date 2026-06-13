import { useMemo } from "react";
import { Table } from "antd";
import CountryFlag from "../../../../../components/components/CountryFlag";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../../constants";
import { getPositionTitle } from "../../../../../containers/utils/fns";
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
  const groupedStorms = useMemo(() => {
    const filtered =
      params.filter === "year"
        ? stormsData.filter((s) => parseInt(s.year.toString()) >= 2000)
        : stormsData;
    return getGroupedStorms(filtered, params.filter);
  }, [stormsData, params.filter]);

  // Average by name keyed as Record<string, number> for "names" grid view
  const nameAverageValues = useMemo<Record<string, number> | null>(() => {
    if (params.filter !== "name") return null;
    const result: Record<string, number> = {};
    Object.entries(groupedStorms).forEach(([name, storms]) => {
      result[name] = calculateAverage(storms);
    });
    return result;
  }, [groupedStorms, params.filter]);

  // Average / name / table → names grid with intensity colors
  if (params.filter === "name" && params.mode === "table") {
    return (
      <StormGrid
        viewType="names"
        stormsData={stormsData}
        onCellClick={onCellClick}
        nameAverageValues={nameAverageValues ?? undefined}
      />
    );
  }

  // Average / year / table → year highlights grid
  if (params.filter === "year" && params.mode === "table") {
    return <StormGrid viewType="yearHighlights" stormsData={stormsData} onCellClick={onCellClick} />;
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

  // List modes (position / name / country / year)
  const data = transformData(groupedStorms, params.filter);

  const widthClass: Record<string, string> = {
    position: "max-w-2xl",
    name: "max-w-2xl",
    country: "max-w-lg",
    year: "max-w-lg",
  };

  return (
    <div className={`mx-auto ${widthClass[params.filter] ?? "max-w-2xl"}`}>
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
