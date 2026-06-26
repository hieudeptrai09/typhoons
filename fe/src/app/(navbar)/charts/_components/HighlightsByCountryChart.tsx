"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Storm } from "../../../../types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  color: string;
}

const CustomTooltip = ({ active, payload, label, color }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-bold text-gray-700">{label}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        Storms: {payload[0].value}
      </p>
    </div>
  );
};

interface HighlightsByCountryChartProps {
  storms: Storm[];
  allCountries: string[];
  color: string;
}

const HighlightsByCountryChart = ({
  storms,
  allCountries,
  color,
}: HighlightsByCountryChartProps) => {
  const countMap: Record<string, number> = {};
  storms.forEach((s) => {
    countMap[s.country] = (countMap[s.country] || 0) + 1;
  });

  const data = allCountries.map((country) => ({
    country,
    count: countMap[country] || 0,
  }));

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
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          allowDecimals={false}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip color={color} />} />
        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HighlightsByCountryChart;
