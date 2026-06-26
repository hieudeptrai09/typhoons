"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TEXT_COLOR_WHITE_BACKGROUND } from "../../../../components/colors";
import { getIntensityFromNumber } from "../../storms/_utils/fns";

interface AverageCountryChartProps {
  data: { country: string; count: number; avgNumber: number }[];
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
      <p className="mb-1 text-sm font-bold text-gray-700">{label}</p>
      <p className="text-sm text-sky-600">Storm Count: {count}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        Avg Intensity: {avg.toFixed(2)}
      </p>
    </div>
  );
};

const AverageCountryChart = ({ data }: AverageCountryChartProps) => {
  // const sorted = [...data].sort((a, b) => a.country.localeCompare(b.country));
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto w-full max-w-4xl px-2">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sorted} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="country"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
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
            formatter={(value: string) => (value === "count" ? "Storm Count" : "Avg Intensity")}
          />
          <Bar yAxisId="left" dataKey="count" fill="#7dd3fc" radius={[4, 4, 0, 0]} barSize={36} />
          <Bar
            yAxisId="right"
            dataKey="avgNumber"
            fill="#fdba74"
            radius={[4, 4, 0, 0]}
            barSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageCountryChart;
