"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../components/colors";
import { getIntensityFromNumber } from "../../storms/_utils/fns";

interface AverageYearChartProps {
  data: { year: number; count: number; avgNumber: number }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const count = payload.find((p) => p.dataKey === "count")?.value ?? 0;
  const avg = payload.find((p) => p.dataKey === "avgNumber")?.value ?? 0;
  const color = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(avg)];

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-bold text-gray-700">Year {label}</p>
      <p className="text-sm text-sky-600">Storm Count: {count}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        Avg Intensity: {avg.toFixed(2)}
      </p>
    </div>
  );
};

const AverageYearChart = ({ data }: AverageYearChartProps) => {
  const byYear = [...data].sort((a, b) => a.year - b.year);
  const sorted: typeof data = [];
  if (byYear.length > 0) {
    const minYear = byYear[0].year;
    const maxYear = byYear[byYear.length - 1].year;
    const yearMap = Object.fromEntries(byYear.map((d) => [d.year, d]));
    for (let y = minYear; y <= maxYear; y++) {
      sorted.push(yearMap[y] || { year: y, count: 0, avgNumber: 0 });
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-2">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={sorted} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            domain={["auto", "auto"]}
            label={{
              value: "Storm Count",
              angle: -90,
              position: "insideLeft",
              offset: 20,
              style: { fontSize: 12, fill: "#6b7280" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            domain={["auto", "auto"]}
            label={{
              value: "Avg Intensity",
              angle: 90,
              position: "insideRight",
              offset: 20,
              style: { fontSize: 12, fill: "#6b7280" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
            formatter={(value: string) =>
              value === "count" ? "Storm Count" : "Avg Intensity"
            }
          />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill="#7dd3fc"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgNumber"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 3, fill: "#f97316" }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageYearChart;
