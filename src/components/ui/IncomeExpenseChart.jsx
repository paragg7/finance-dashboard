"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { incomeExpenseChartData } from "@/data/dashboardCards";

// Color constants for consistency
const COLORS = {
  income: "#10B981", // Emerald green - money coming in
  expense: "#F43F5E", // Rose red - money going out
};

// Global styles to remove focus outlines from Recharts elements
const globalStyles = `
  .recharts-wrapper,
  .recharts-wrapper *,
  .recharts-surface,
  .recharts-surface:focus,
  .recharts-layer,
  .recharts-layer:focus,
  .recharts-bar-rectangle,
  .recharts-bar-rectangle:focus,
  svg:focus,
  rect:focus,
  g:focus,
  path:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

function CustomTooltip({
  active,
  payload,
  label,
  currency = "₹",
}) {
  if (!active || !payload || payload.length === 0) return null;

  // Reverse to show income first (since it's at bottom of stack)
  const orderedPayload = [...payload].reverse();

  // Calculate total for this specific data point
  const total = orderedPayload.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="min-w-[170px] rounded-xl border border-gray-200/90 bg-[#1f1f1f] px-3 py-2.5 shadow-lg">
      <p className="mb-2 text-[11px] font-medium text-white">{label}</p>

      <div className="space-y-1.5">
        {orderedPayload.map((item) => {
          // Calculate percentage relative to this data point's total
          const percent = total > 0 ? ((item.value || 0) / total) * 100 : 0;

          return (
            <div
              key={item.dataKey}
              className="flex items-center justify-between gap-4 text-[11px]"
            >
              <div className="flex items-center gap-1.5 text-gray-200">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                  aria-hidden="true"
                />
                <span className="capitalize">{item.dataKey}</span>
                <span className="text-gray-400">({percent.toFixed(1)}%)</span>
              </div>

              <span className="font-semibold text-white">
                {currency}
                {Number(item.value || 0).toLocaleString()}
              </span>
            </div>
          );
        })}

        {/* Total row */}
        {orderedPayload.length === 2 && (
          <div className="mt-2 flex items-center justify-between gap-4 border-t border-gray-600 pt-2 text-[11px]">
            <span className="text-gray-300">Total</span>
            <span className="font-semibold text-white">
              {currency}
              {total.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function useIsDesktop() {
  // Initialize with null to detect SSR
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    // Only runs on client
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    const update = (e) => setIsDesktop(e.matches);
    
    // Set initial value
    setIsDesktop(mediaQuery.matches);
    
    // Use the correct event listener method
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(update);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", update);
      } else {
        mediaQuery.removeListener(update);
      }
    };
  }, []);

  // Return false during SSR and initial render to prevent hydration mismatch
  return isDesktop ?? false;
}

export default function IncomeExpenseChartCard({
  title = "Income vs Expenses",
  currency = "₹",
  footer = "Monthly overview of income and expense trends",
  showFooter = false,
}) {
  const [range, setRange] = useState("monthly");
  const [mobilePage, setMobilePage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const isDesktop = useIsDesktop();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const chartWrapperRef = useRef(null);

  const totalData = incomeExpenseChartData.length;
  const mobileYearlyChunk = 6;
  const maxMobilePages = Math.max(
    0,
    Math.ceil(totalData / mobileYearlyChunk) - 1
  );

  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset state when range changes or desktop/mobile switch
  useEffect(() => {
    setMobilePage(0);
    setActiveIndex(null);
    setSelectedMonth(null);
  }, [range, isDesktop]);

  // Dynamic data — supports daily drill-down
  const visibleData = useMemo(() => {
    if (selectedMonth) {
      return (selectedMonth.days || []).map((d) => ({
        month: d.day,
        income: d.income,
        expense: d.expense,
      }));
    }

    if (range === "monthly") return incomeExpenseChartData.slice(0, 5);
    if (range === "quarterly") return incomeExpenseChartData.slice(0, 4);

    if (range === "yearly") {
      if (isDesktop) return incomeExpenseChartData;

      const start = mobilePage * mobileYearlyChunk;
      const end = start + mobileYearlyChunk;
      return incomeExpenseChartData.slice(start, end);
    }

    return incomeExpenseChartData.slice(0, 5);
  }, [range, isDesktop, mobilePage, selectedMonth]);

  // Totals for header
  const totals = useMemo(() => {
    const income = visibleData.reduce((sum, item) => sum + (item.income || 0), 0);
    const expense = visibleData.reduce((sum, item) => sum + (item.expense || 0), 0);
    return { income, expense };
  }, [visibleData]);

  // Max value for Y-axis (now sum of income + expense for stacked bars)
  const maxValue = useMemo(() => {
    if (visibleData.length === 0) return 0;
    
    return Math.max(
      ...visibleData.map((item) => {
        if (showIncome && showExpense) return (item.income || 0) + (item.expense || 0);
        if (showIncome) return item.income || 0;
        if (showExpense) return item.expense || 0;
        return 0;
      }),
      0
    );
  }, [visibleData, showIncome, showExpense]);

  // Chart data - memoized properly
  const chartData = useMemo(() => {
    return visibleData.map((item, index) => ({
      ...item,
      // Preserve original index to find source data
      _originalIndex: index,
    }));
  }, [visibleData]);

  // Mobile swipe handlers
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (range !== "yearly" || isDesktop || selectedMonth) return;
    if (Math.abs(diff) < 40) return;

    if (diff > 0 && mobilePage < maxMobilePages) {
      setMobilePage((prev) => prev + 1);
    } else if (diff < 0 && mobilePage > 0) {
      setMobilePage((prev) => prev - 1);
    }
  }, [range, isDesktop, selectedMonth, mobilePage, maxMobilePages]);

  // Toggle visibility with proper state updates
  const toggleIncome = useCallback(() => {
    setShowIncome((prev) => {
      const next = !prev;
      // Ensure at least one is always visible
      if (!next && !showExpense) {
        setShowExpense(true);
      }
      return next;
    });
  }, [showExpense]);

  const toggleExpense = useCallback(() => {
    setShowExpense((prev) => {
      const next = !prev;
      // Ensure at least one is always visible
      if (!next && !showIncome) {
        setShowIncome(true);
      }
      return next;
    });
  }, [showIncome]);

  // Handle bar click → drill down
  const handleBarClick = useCallback((data, index) => {
    if (selectedMonth) return;
    
    // Find the original data entry that has days
    const originalData = incomeExpenseChartData.find(
      (item) => item.month === data.month
    );
    
    if (originalData?.days?.length > 0) {
      setSelectedMonth(originalData);
    }
  }, [selectedMonth]);

  // Determine radius based on which bars are visible - memoized
  const incomeRadius = useMemo(() => {
    if (showIncome && showExpense) return [0, 0, 10, 10];
    return [10, 10, 10, 10];
  }, [showIncome, showExpense]);

  const expenseRadius = useMemo(() => {
    if (showIncome && showExpense) return [10, 10, 0, 0];
    return [10, 10, 10, 10];
  }, [showIncome, showExpense]);

  // Handle range change
  const handleRangeChange = useCallback((e) => {
    setRange(e.target.value);
    setActiveIndex(null);
    setSelectedMonth(null);
  }, []);

  // Handle mouse leave on chart
  const handleChartMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  // Handle mouse enter on bar
  const handleBarMouseEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  // Check if bars should be clickable
  const isBarsClickable = !selectedMonth && incomeExpenseChartData.some(item => item.days?.length > 0);

  return (
    <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5">
      {/* Inject global styles */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-[13px] font-medium text-gray-900">
            {selectedMonth ? `${selectedMonth.month} Daily View` : title}
          </h3>
          <p className="mt-1 text-[11px] text-gray-500">
            Income {currency}
            {totals.income.toLocaleString()} · Expense {currency}
            {totals.expense.toLocaleString()}
          </p>

          {/* Back button */}
          {selectedMonth && (
            <button
              type="button"
              onClick={() => setSelectedMonth(null)}
              className="mt-2 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              aria-label="Go back to monthly view"
            >
              ← Back to monthly view
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div 
            className="flex items-center gap-2 text-[11px] text-gray-700"
            role="group"
            aria-label="Toggle chart data visibility"
          >
            <button
              type="button"
              onClick={toggleIncome}
              aria-pressed={showIncome}
              aria-label={`${showIncome ? 'Hide' : 'Show'} income data`}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                showIncome ? "border border-gray-200 bg-white" : "opacity-50"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS.income }}
                aria-hidden="true"
              />
              Income
            </button>

            <button
              type="button"
              onClick={toggleExpense}
              aria-pressed={showExpense}
              aria-label={`${showExpense ? 'Hide' : 'Show'} expense data`}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
                showExpense ? "border border-gray-200 bg-white" : "opacity-50"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS.expense }}
                aria-hidden="true"
              />
              Expense
            </button>
          </div>

          {/* Range selector */}
          <div className="relative w-full shrink-0 sm:w-[110px]">
            <label htmlFor="range-select" className="sr-only">
              Select time range
            </label>
            <select
              id="range-select"
              value={range}
              onChange={handleRangeChange}
              disabled={!!selectedMonth}
              className="h-7 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-6 text-[11px] text-gray-700 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartWrapperRef}
        className="mt-3 w-full rounded-md bg-white/40 px-2 py-2 outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="img"
        aria-label={`Bar chart showing ${selectedMonth ? `daily ${selectedMonth.month}` : range} income and expense data`}
      >
        <div className="h-[220px] w-full outline-none sm:h-[250px] lg:h-[270px]">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 6, left: 0, bottom: 0 }}
                barCategoryGap="30%"
                onMouseLeave={handleChartMouseLeave}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={0}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={52}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickFormatter={(v) => Number(v).toLocaleString()}
                  domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                />

                <Tooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{
                    fill: "rgba(148,163,184,0.08)",
                  }}
                  wrapperStyle={{ outline: "none" }}
                />

                {/* Income Bar (Bottom of stack) - Emerald Green */}
                {showIncome && (
                  <Bar
                    dataKey="income"
                    name="Income"
                    stackId="stack"
                    barSize={32}
                    radius={incomeRadius}
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="ease-out"
                    onMouseEnter={handleBarMouseEnter}
                    onClick={handleBarClick}
                    style={{ cursor: isBarsClickable ? "pointer" : "default" }}
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={`income-${entry.month}-${i}`}
                        fill={COLORS.income}
                        fillOpacity={
                          activeIndex === null
                            ? 1
                            : i === activeIndex
                            ? 1
                            : 0.4
                        }
                      />
                    ))}
                  </Bar>
                )}

                {/* Expense Bar (Top of stack) - Rose Red */}
                {showExpense && (
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    stackId="stack"
                    barSize={32}
                    radius={expenseRadius}
                    isAnimationActive={true}
                    animationDuration={300}
                    animationEasing="ease-out"
                    onMouseEnter={handleBarMouseEnter}
                    onClick={handleBarClick}
                    style={{ cursor: isBarsClickable ? "pointer" : "default" }}
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={`expense-${entry.month}-${i}`}
                        fill={COLORS.expense}
                        fillOpacity={
                          activeIndex === null
                            ? 1
                            : i === activeIndex
                            ? 1
                            : 0.4
                        }
                      />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {/* Loading placeholder during SSR */}
          {!isClient && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile page indicators */}
      {range === "yearly" &&
        !isDesktop &&
        maxMobilePages > 0 &&
        !selectedMonth && (
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[10px] text-gray-500">
              Swipe left or right to view more months
            </span>

            <div 
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Chart page indicators"
            >
              {Array.from({ length: maxMobilePages + 1 }).map((_, i) => (
                <button
                  key={`page-${i}`}
                  type="button"
                  onClick={() => setMobilePage(i)}
                  className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                    mobilePage === i ? "w-4 bg-gray-700" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  role="tab"
                  aria-selected={mobilePage === i}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      {/* Footer */}
      {showFooter && footer && (
        <div className="mt-3 rounded-md bg-white/70 px-2.5 py-2 text-[11px] text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
}