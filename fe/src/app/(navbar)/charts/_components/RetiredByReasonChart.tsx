"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { RetiredName } from "../../../../types";

interface RetiredByReasonChartProps {
  retiredNames: RetiredName[];
}

const REASON_LABELS: Record<number, string> = {
  0: "Destructive Storm",
  1: "Language Problem",
  2: "Misspelling",
  3: "Special Storm",
};

const COLORS = ["#dc2626", "#16a34a", "#f59e0b", "#8b5cf6"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { reason: number } }[];
}) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: entry } = payload[0];
  const color = COLORS[entry.reason] || "#6b7280";
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-bold text-gray-700">{name}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        Names: {value}
      </p>
    </div>
  );
};

const RetiredByReasonChart = ({ retiredNames }: RetiredByReasonChartProps) => {
  const countMap: Record<number, number> = {};
  retiredNames.forEach((n) => {
    const reason = n.isLanguageProblem;
    countMap[reason] = (countMap[reason] || 0) + 1;
  });

  const data = Object.entries(countMap).map(([reason, count]) => ({
    name: REASON_LABELS[Number(reason)] || `Unknown (${reason})`,
    value: count,
    reason: Number(reason),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={0}
          dataKey="value"
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          labelLine={{ stroke: "#9ca3af" }}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.reason] || "#6b7280"} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RetiredByReasonChart;
