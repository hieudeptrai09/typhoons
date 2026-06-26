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
import type { TyphoonName } from "../../../../types";

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
  const active_ = payload.find((p) => p.dataKey === "active")?.value ?? 0;
  const retired = payload.find((p) => p.dataKey === "retired")?.value ?? 0;
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-bold text-gray-700">{label}</p>
      <p className="text-sm font-semibold text-green-600">Active: {active_}</p>
      <p className="text-sm font-semibold text-red-600">Retired: {retired}</p>
    </div>
  );
};

interface NamesByCountryChartProps {
  names: TyphoonName[];
}

const NamesByCountryChart = ({ names }: NamesByCountryChartProps) => {
  const countMap: Record<string, { active: number; retired: number }> = {};
  names.forEach((n) => {
    if (!countMap[n.country]) countMap[n.country] = { active: 0, retired: 0 };
    if (n.isRetired) {
      countMap[n.country].retired += 1;
    } else {
      countMap[n.country].active += 1;
    }
  });

  const data = Object.entries(countMap)
    .map(([country, counts]) => ({ country, ...counts }))
    .sort((a, b) => a.country.localeCompare(b.country));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="country"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          interval={0}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} domain={["auto", "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="active" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} barSize={32} />
        <Bar dataKey="retired" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NamesByCountryChart;
