import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { ChevronDown } from "lucide-react";

const chartData = [
  { month: "Jan", income: 28000, expense: 36000 },
  { month: "Feb", income: 42000, expense: 61000 },
  { month: "Mar", income: 36000, expense: 28000 },
  { month: "Apr", income: 48000, expense: 54000 },
  { month: "May", income: 68000, expense: 68000 },
  { month: "Jun", income: 80435, expense: 12840, active: true },
  { month: "Jul", income: 52000, expense: 64000 },
  { month: "Aug", income: 47000, expense: 52000 },
  { month: "Sep", income: 76000, expense: 50000 },
  { month: "Oct", income: 49000, expense: 36000 },
  { month: "Nov", income: 31000, expense: 21000 },
  { month: "Dec", income: 36000, expense: 28000 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const income = payload.find((item) => item.dataKey === "income")?.value;
  const expense = payload.find((item) => item.dataKey === "expense")?.value;

  const incomeGrowth = "+74.5%";
  const expenseGrowth = "-3.25";

  return (
    <div className="min-w-[155px] rounded-xl bg-[#1F1F1F] px-4 py-3 text-white shadow-lg">
      <p className="text-[22px] font-semibold leading-none">
        ${income?.toLocaleString()}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1 text-xs text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Income
        </span>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
          ↗ {incomeGrowth}
        </span>
      </div>

      <p className="mt-3 text-[22px] font-semibold leading-none">
        ${expense?.toLocaleString()}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1 text-xs text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F2B94B]" />
          Expense
        </span>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">
          ↘ {expenseGrowth}
        </span>
      </div>
    </div>
  );
}

export default function IncomeExpenseChart() {
  return (
    <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Income vs Expenses
        </h3>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gray-300" />
              Expense
            </span>
          </div>

          {/* Filter button */}
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
            Monthly
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap={14}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#E8ECEF"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{
                fill: "rgba(0,0,0,0.05)",
                radius: 10,
              }}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="income"
              radius={[4, 4, 0, 0]}
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`income-${index}`}
                  fill={entry.active ? "#20B2A6" : "#BFE9E5"}
                />
              ))}
            </Bar>

            <Bar
              dataKey="expense"
              radius={[4, 4, 0, 0]}
              barSize={20}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`expense-${index}`}
                  fill={entry.active ? "#0F2F2E" : "#E7F1F3"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}