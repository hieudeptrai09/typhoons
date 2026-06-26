"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { RetiredName } from "../../../../types";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-bold text-gray-700">Year {label}</p>
      <p className="text-sm font-semibold text-orange-500">Retired: {payload[0].value}</p>
    </div>
  );
};

interface RetiredByYearChartProps {
  retiredNames: RetiredName[];
}

const RetiredByYearChart = ({ retiredNames }: RetiredByYearChartProps) => {
  const countMap: Record<number, number> = {};
  retiredNames.forEach((n) => {
    if (n.lastYear) {
      countMap[n.lastYear] = (countMap[n.lastYear] || 0) + 1;
    }
  });

  const years = Object.keys(countMap).map(Number);
  if (years.length === 0) return null;

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const data: { year: number; count: number }[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    data.push({ year: y, count: countMap[y] || 0 });
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          allowDecimals={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RetiredByYearChart;
