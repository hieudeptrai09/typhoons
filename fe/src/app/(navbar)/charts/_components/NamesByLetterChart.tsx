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
      <p className="mb-1 text-sm font-bold text-gray-700">Letter {label}</p>
      <p className="text-sm font-semibold text-green-600">Active: {active_}</p>
      <p className="text-sm font-semibold text-red-600">Retired: {retired}</p>
    </div>
  );
};

interface NamesByLetterChartProps {
  names: TyphoonName[];
}

const NamesByLetterChart = ({ names }: NamesByLetterChartProps) => {
  const letterMap: Record<string, { active: number; retired: number }> = {};

  names.forEach((n) => {
    const letter = n.name.charAt(0).toUpperCase();
    if (!letterMap[letter]) letterMap[letter] = { active: 0, retired: 0 };
    if (n.isRetired) {
      letterMap[letter].retired += 1;
    } else {
      letterMap[letter].active += 1;
    }
  });

  const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
    letter,
    active: letterMap[letter]?.active ?? 0,
    retired: letterMap[letter]?.retired ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="letter"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          interval={0}
        />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} domain={["auto", "auto"]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
        <Bar dataKey="active" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} barSize={20} />
        <Bar dataKey="retired" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NamesByLetterChart;
