// src/components/dashboard/IncomeExpenseChart.jsx
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

// Color constants
const COLORS = {
  income: "#10B981",
  expense: "#F43F5E",
};

// Global styles to remove focus outlines from Recharts
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

function CustomTooltip({ active, payload, label, currency = "₹" }) {
  if (!active || !payload || payload.length === 0) return null;

  const orderedPayload = [...payload].reverse();
  const total = orderedPayload.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="min-w-[150px] rounded-xl border border-gray-200/90 bg-[#1f1f1f] px-2.5 py-2 shadow-lg sm:min-w-[170px] sm:px-3 sm:py-2.5">
      <p className="mb-1.5 text-[10px] font-medium text-white sm:mb-2 sm:text-[11px]">{label}</p>

      <div className="space-y-1 sm:space-y-1.5">
        {orderedPayload.map((item) => {
          const percent = total > 0 ? ((item.value || 0) / total) * 100 : 0;

          return (
            <div
              key={item.dataKey}
              className="flex items-center justify-between gap-3 text-[10px] sm:gap-4 sm:text-[11px]"
            >
              <div className="flex items-center gap-1 text-gray-200 sm:gap-1.5">
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

        {orderedPayload.length === 2 && (
          <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-gray-600 pt-1.5 text-[10px] sm:mt-2 sm:gap-4 sm:pt-2 sm:text-[11px]">
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
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    const update = (e) => setIsDesktop(e.matches);
    setIsDesktop(mediaQuery.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
    } else {
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

  return isDesktop ?? false;
}

// Hook to detect tablet breakpoint
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    
    const update = (e) => setIsTablet(e.matches);
    setIsTablet(mediaQuery.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
    } else {
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

  return isTablet ?? false;
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
  const isTablet = useIsTablet();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const chartWrapperRef = useRef(null);

  const totalData = incomeExpenseChartData.length;
  const mobileYearlyChunk = 6;
  const maxMobilePages = Math.max(
    0,
    Math.ceil(totalData / mobileYearlyChunk) - 1
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setMobilePage(0);
    setActiveIndex(null);
    setSelectedMonth(null);
  }, [range, isDesktop]);

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

  const totals = useMemo(() => {
    const income = visibleData.reduce((sum, item) => sum + (item.income || 0), 0);
    const expense = visibleData.reduce((sum, item) => sum + (item.expense || 0), 0);
    return { income, expense };
  }, [visibleData]);

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

  const chartData = useMemo(() => {
    return visibleData.map((item, index) => ({
      ...item,
      _originalIndex: index,
    }));
  }, [visibleData]);

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

  const toggleIncome = useCallback(() => {
    setShowIncome((prev) => {
      const next = !prev;
      if (!next && !showExpense) {
        setShowExpense(true);
      }
      return next;
    });
  }, [showExpense]);

  const toggleExpense = useCallback(() => {
    setShowExpense((prev) => {
      const next = !prev;
      if (!next && !showIncome) {
        setShowIncome(true);
      }
      return next;
    });
  }, [showIncome]);

  const handleBarClick = useCallback((data, index) => {
    if (selectedMonth) return;
    
    const originalData = incomeExpenseChartData.find(
      (item) => item.month === data.month
    );
    
    if (originalData?.days?.length > 0) {
      setSelectedMonth(originalData);
    }
  }, [selectedMonth]);

  const incomeRadius = useMemo(() => {
    if (showIncome && showExpense) return [0, 0, 10, 10];
    return [10, 10, 10, 10];
  }, [showIncome, showExpense]);

  const expenseRadius = useMemo(() => {
    if (showIncome && showExpense) return [10, 10, 0, 0];
    return [10, 10, 10, 10];
  }, [showIncome, showExpense]);

  const handleRangeChange = useCallback((e) => {
    setRange(e.target.value);
    setActiveIndex(null);
    setSelectedMonth(null);
  }, []);

  const handleChartMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleBarMouseEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const isBarsClickable = !selectedMonth && incomeExpenseChartData.some(item => item.days?.length > 0);

  // Responsive bar size
  const barSize = isDesktop ? 32 : isTablet ? 28 : 20;

  // Responsive Y-axis width
  const yAxisWidth = isDesktop ? 52 : isTablet ? 48 : 40;

  return (
    <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* ─── Header - RESPONSIVE ─── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-xs font-medium text-gray-900 sm:text-[13px]">
            {selectedMonth ? `${selectedMonth.month} Daily View` : title}
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-[11px]">
            Income {currency}
            {totals.income.toLocaleString()} · Expense {currency}
            {totals.expense.toLocaleString()}
          </p>

          {selectedMonth && (
            <button
              type="button"
              onClick={() => setSelectedMonth(null)}
              className="mt-1.5 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:mt-2 sm:text-[11px]"
              aria-label="Go back to monthly view"
            >
              ← Back to monthly view
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
          {/* Toggle buttons - RESPONSIVE */}
          <div 
            className="flex items-center gap-1.5 text-[10px] text-gray-700 sm:gap-2 sm:text-[11px]"
            role="group"
            aria-label="Toggle chart data visibility"
          >
            <button
              type="button"
              onClick={toggleIncome}
              aria-pressed={showIncome}
              aria-label={`${showIncome ? 'Hide' : 'Show'} income data`}
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:gap-1.5 sm:px-2.5 sm:py-1 ${
                showIncome ? "border border-gray-200 bg-white" : "opacity-50"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span
                className="inline-flex h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
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
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:gap-1.5 sm:px-2.5 sm:py-1 ${
                showExpense ? "border border-gray-200 bg-white" : "opacity-50"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span
                className="inline-flex h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
                style={{ backgroundColor: COLORS.expense }}
                aria-hidden="true"
              />
              Expense
            </button>
          </div>

          {/* Range selector - RESPONSIVE */}
          <div className="relative w-[90px] shrink-0 sm:w-[100px] lg:w-[110px]">
            <label htmlFor="range-select" className="sr-only">
              Select time range
            </label>
            <select
              id="range-select"
              value={range}
              onChange={handleRangeChange}
              disabled={!!selectedMonth}
              className="h-6 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-5 text-[10px] text-gray-700 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-7 sm:pr-6 sm:text-[11px]"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ChevronDown
              size={10}
              className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 sm:right-2 sm:h-3 sm:w-3"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ─── Chart - RESPONSIVE HEIGHT ─── */}
      <div
        ref={chartWrapperRef}
        className="mt-2.5 w-full rounded-md bg-white/40 px-1.5 py-1.5 outline-none sm:mt-3 sm:px-2 sm:py-2"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="img"
        aria-label={`Bar chart showing ${selectedMonth ? `daily ${selectedMonth.month}` : range} income and expense data`}
      >
        {/* Responsive chart height */}
        <div className="h-[180px] w-full outline-none sm:h-[220px] md:h-[250px] lg:h-[270px]">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ 
                  top: 8, 
                  right: 4, 
                  left: 0, 
                  bottom: 0 
                }}
                barCategoryGap={isDesktop ? "30%" : isTablet ? "25%" : "20%"}
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
                  tickMargin={8}
                  interval={0}
                  tick={{ 
                    fontSize: isDesktop ? 11 : isTablet ? 10 : 9, 
                    fill: "#6B7280" 
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  width={yAxisWidth}
                  tick={{ 
                    fontSize: isDesktop ? 10 : 9, 
                    fill: "#9CA3AF" 
                  }}
                  tickFormatter={(v) => {
                    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                    return Number(v).toLocaleString();
                  }}
                  domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
                />

                <Tooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{
                    fill: "rgba(148,163,184,0.08)",
                  }}
                  wrapperStyle={{ outline: "none" }}
                />

                {showIncome && (
                  <Bar
                    dataKey="income"
                    name="Income"
                    stackId="stack"
                    barSize={barSize}
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

                {showExpense && (
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    stackId="stack"
                    barSize={barSize}
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
          
          {!isClient && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile page indicators - RESPONSIVE ─── */}
      {range === "yearly" &&
        !isDesktop &&
        maxMobilePages > 0 &&
        !selectedMonth && (
          <div className="mt-2 flex items-center justify-between gap-2 sm:gap-3">
            <span className="text-[9px] text-gray-500 sm:text-[10px]">
              Swipe left or right to view more months
            </span>

            <div 
              className="flex items-center gap-1 sm:gap-1.5"
              role="tablist"
              aria-label="Chart page indicators"
            >
              {Array.from({ length: maxMobilePages + 1 }).map((_, i) => (
                <button
                  key={`page-${i}`}
                  type="button"
                  onClick={() => setMobilePage(i)}
                  className={`h-1 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 sm:h-1.5 ${
                    mobilePage === i 
                      ? "w-3 bg-gray-700 sm:w-4" 
                      : "w-1 bg-gray-300 hover:bg-gray-400 sm:w-1.5"
                  }`}
                  role="tab"
                  aria-selected={mobilePage === i}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      {/* ─── Footer - RESPONSIVE ─── */}
      {showFooter && footer && (
        <div className="mt-2.5 rounded-md bg-white/70 px-2 py-1.5 text-[10px] text-gray-600 sm:mt-3 sm:px-2.5 sm:py-2 sm:text-[11px]">
          {footer}
        </div>
      )}
    </div>
  );
}

IncomeExpenseChartCard.displayName = "IncomeExpenseChartCard";