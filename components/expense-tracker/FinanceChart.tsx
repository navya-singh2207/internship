"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ChartDatum = {
  label: string;
  income: number;
  expense: number;
};

type FinanceChartProps = {
  data: ChartDatum[];
  currencyFormatter: Intl.NumberFormat;
};

export default function FinanceChart({
  data,
  currencyFormatter,
}: FinanceChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={20}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 12 }}
            tickFormatter={(value) =>
              currencyFormatter.format(Number(value)).replace(".00", "")
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              borderRadius: "16px",
              backgroundColor: "#12111a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f4f5f7",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            }}
            formatter={(value: number, name: string) => [
              currencyFormatter.format(value),
              name === "income" ? "Income" : "Expenses",
            ]}
          />
          <Bar
            dataKey="income"
            radius={[8, 8, 0, 0]}
            fill="rgba(91, 227, 169, 0.9)"
          />
          <Bar
            dataKey="expense"
            radius={[8, 8, 0, 0]}
            fill="rgba(109, 124, 255, 0.9)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
