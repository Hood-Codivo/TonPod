"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PricePoint } from "@/lib/priceHistory";

export function PriceChart({
  points,
  loading,
}: {
  points: PricePoint[];
  loading: boolean;
}) {
  if (loading) {
    return <p className="text-xs text-zinc-500">Loading price history...</p>;
  }
  if (points.length === 0) {
    return <p className="text-xs text-zinc-500">No trades yet.</p>;
  }

  const data = points.map((p) => ({
    ...p,
    label: new Date(p.time * 1000).toLocaleTimeString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-zinc-200 dark:stroke-zinc-800"
        />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} minTickGap={30} />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} width={70} />
        <Tooltip
          formatter={(value, _name, item) => {
            const num = typeof value === "number" ? value : Number(value);
            const side = (item?.payload as PricePoint | undefined)?.side;
            return [num.toPrecision(6), side === "buy" ? "Buy" : "Sell"];
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#3b82f6"
          strokeWidth={1.5}
          isAnimationActive={false}
          dot={(props: {
            cx?: number;
            cy?: number;
            payload?: PricePoint & { label: string };
          }) => {
            const { cx, cy, payload } = props;
            if (cx === undefined || cy === undefined || !payload)
              return <g key={`${cx}-${cy}`} />;
            const color = payload.side === "buy" ? "#22c55e" : "#ef4444";
            return (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                stroke={color}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
