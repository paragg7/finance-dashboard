// src/components/dashboard/pieChart.jsx
"use client";

import React, { useMemo, useState, useCallback, useId } from "react";
import {
  ChevronDown,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Home,
  Heart,
  Plane,
  Smartphone,
  GraduationCap,
  Dumbbell,
  Coffee,
  Gift,
  CreditCard,
} from "lucide-react";
import { defaultData } from "@/data/dashboardCards";

// Extended icon map
const iconMap = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Gamepad2,
  Bills: Receipt,
  Housing: Home,
  Health: Heart,
  Travel: Plane,
  Technology: Smartphone,
  Education: GraduationCap,
  Fitness: Dumbbell,
  Coffee: Coffee,
  Gifts: Gift,
  Subscriptions: CreditCard,
  default: Receipt,
};

// Default colors
const DEFAULT_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-indigo-500",
];

// Period labels
const PERIOD_LABELS = {
  monthly: "month",
  quarterly: "quarter",
  yearly: "year",
};

// Scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }
`;

function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
}

function formatCurrency(amount, currency = "₹", locale = "en-IN") {
  const num = Number(amount);
  if (isNaN(num)) return `${currency}0`;
  
  if (Math.abs(num) >= 10000000) {
    return `${currency}${(num / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `${currency}${(num / 100000).toFixed(2)}L`;
  }
  
  return `${currency}${num.toLocaleString(locale)}`;
}

function normalizeCategories(categories, defaultColors = DEFAULT_COLORS) {
  if (!Array.isArray(categories)) return [];
  
  return categories
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `category-${index}-${item.label || index}`,
      label: item.label || `Category ${index + 1}`,
      amount: Math.max(0, Number(item.amount) || 0),
      color: item.color || defaultColors[index % defaultColors.length],
      icon: item.icon || item.label || "default",
    }));
}

export default function SpendingBreakdownList({
  title = "Insights",
  currency = "₹",
  locale = "en-IN",
  data = defaultData,
  showFooter = true,
  isLoading = false,
  maxHeight = 180,
  onCategorySelect,
}) {
  const [range, setRange] = useState("monthly");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const selectId = useId();
  const listId = useId();

  const categories = useMemo(() => {
    const rawCategories = data?.[range] || data?.monthly || [];
    return normalizeCategories(rawCategories);
  }, [data, range]);

  const total = useMemo(() => {
    return categories.reduce((sum, item) => sum + item.amount, 0);
  }, [categories]);

  const topCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.reduce((top, current) => 
      current.amount > (top?.amount || 0) ? current : top
    , null);
  }, [categories]);

  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    if (selectedCategory) {
      const found = categories.find((item) => item.id === selectedCategory);
      if (found) return found;
    }
    return topCategory;
  }, [categories, selectedCategory, topCategory]);

  const periodLabel = PERIOD_LABELS[range] || "month";

  const handleRangeChange = useCallback((e) => {
    setRange(e.target.value);
    setSelectedCategory(null);
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect?.(categoryId);
  }, [onCategorySelect]);

  const handleKeyDown = useCallback((e, categoryId, index) => {
    const buttons = document.querySelectorAll(`[data-category-list="${listId}"] button`);
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = Math.min(index + 1, buttons.length - 1);
        buttons[nextIndex]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        buttons[prevIndex]?.focus();
        break;
      case "Home":
        e.preventDefault();
        buttons[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        buttons[buttons.length - 1]?.focus();
        break;
    }
  }, [listId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING SKELETON - Responsive
  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div 
        className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4"
        aria-busy="true"
        aria-label="Loading spending breakdown"
      >
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-16 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-20" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200 sm:h-7 sm:w-24" />
        </div>
        <div className="mt-2.5 sm:mt-3">
          <div className="h-6 w-28 animate-pulse rounded bg-gray-200 sm:h-7 sm:w-32" />
          <div className="mt-1 h-2.5 w-36 animate-pulse rounded bg-gray-200 sm:h-3 sm:w-40" />
        </div>
        <div className="mt-2.5 h-1.5 w-full animate-pulse rounded-full bg-gray-200 sm:mt-3 sm:h-2" />
        <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 sm:gap-3 sm:p-2">
              <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-200 sm:h-7 sm:w-7" />
              <div className="flex-1">
                <div className="h-2.5 w-16 animate-pulse rounded bg-gray-200 sm:h-3 sm:w-20" />
                <div className="mt-1 h-2 w-10 animate-pulse rounded bg-gray-200 sm:w-12" />
              </div>
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY STATE - Responsive
  // ─────────────────────────────────────────────────────────────────────────────
  if (categories.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xs font-medium text-gray-900 sm:text-[13px]">{title}</h3>
          <div className="relative w-full shrink-0 sm:w-[100px] lg:w-[110px]">
            <label htmlFor={selectId} className="sr-only">
              Select time range
            </label>
            <select
              id={selectId}
              value={range}
              onChange={handleRangeChange}
              className="h-6 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-5 text-[10px] text-gray-700 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 sm:h-7 sm:pr-6 sm:text-[11px]"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ChevronDown
              size={10}
              className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 sm:right-2 sm:h-3 sm:w-3"
              aria-hidden="true"
            />
          </div>
        </div>
        
        <div className="mt-6 flex flex-col items-center justify-center py-4 text-center sm:mt-8 sm:py-6">
          <Receipt size={28} className="text-gray-300 sm:h-8 sm:w-8" aria-hidden="true" />
          <p className="mt-2 text-xs text-gray-500 sm:text-sm">No spending data available</p>
          <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
            Add transactions to see your spending breakdown
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER - Responsive
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      {/* ─── Header - RESPONSIVE ─── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xs font-medium text-gray-900 sm:text-[13px]">{title}</h3>

        <div className="relative w-full shrink-0 sm:w-[100px] lg:w-[110px]">
          <label htmlFor={selectId} className="sr-only">
            Select time range
          </label>
          <select
            id={selectId}
            value={range}
            onChange={handleRangeChange}
            className="h-6 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-5 text-[10px] text-gray-700 outline-none transition-colors focus:border-gray-300 focus:ring-2 focus:ring-gray-200 sm:h-7 sm:pr-6 sm:text-[11px]"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDown
            size={10}
            className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 sm:right-2 sm:h-3 sm:w-3"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ─── Total Amount - RESPONSIVE ─── */}
      <div className="mt-2.5 sm:mt-3">
        <div 
          className="text-[22px] font-semibold leading-none tracking-tight text-gray-900 sm:text-[24px] md:text-[26px]"
          aria-label={`Total spent: ${formatCurrency(total, currency, locale)}`}
        >
          {formatCurrency(total, currency, locale)}
        </div>
        <div className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-[12px]">
          Total spent this {periodLabel}
        </div>
      </div>

      {/* ─── Combined Progress Bar - RESPONSIVE ─── */}
      <div 
        className="mt-2.5 flex w-full items-center gap-0.5 overflow-hidden rounded-full bg-gray-200/80 p-[2px] sm:mt-3"
        role="img"
        aria-label={`Spending breakdown across ${categories.length} categories`}
      >
        {categories.map((item) => {
          const percent = calculatePercentage(item.amount, total);
          
          return (
            <div
              key={item.id}
              className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${item.color}`}
              style={{ 
                width: `${percent}%`,
                minWidth: percent > 0 ? "4px" : "0px",
              }}
              title={`${item.label}: ${percent.toFixed(1)}%`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* ─── Category List - RESPONSIVE ─── */}
      <div className="relative mt-2.5 sm:mt-3">
        <div 
          className="custom-scrollbar overflow-y-auto pr-1"
          style={{ maxHeight: `${maxHeight}px` }}
          role="listbox"
          aria-label="Spending categories"
          aria-activedescendant={activeCategory?.id}
          data-category-list={listId}
        >
          {categories.map((item, index) => {
            const percent = calculatePercentage(item.amount, total);
            const isTop = topCategory?.id === item.id;
            const isActive = activeCategory?.id === item.id;
            const Icon = iconMap[item.icon] || iconMap[item.label] || iconMap.default;

            return (
              <button
                key={item.id}
                id={item.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleCategorySelect(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id, index)}
                className={`group flex w-full items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 sm:gap-3 sm:px-2 sm:py-2 ${
                  isActive
                    ? "border border-gray-200 bg-white shadow-sm"
                    : "border border-transparent hover:border-gray-100 hover:bg-white/80"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                  {/* Icon - RESPONSIVE */}
                  <div 
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-7 sm:w-7 ${
                      isActive 
                        ? "border-gray-300 bg-gray-50" 
                        : "border-gray-200 bg-white group-hover:border-gray-300"
                    }`}
                  >
                    <Icon 
                      size={12} 
                      className="text-gray-700 sm:h-[14px] sm:w-[14px]" 
                      aria-hidden="true"
                    />
                  </div>

                  {/* Label & Percentage - RESPONSIVE */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="truncate text-[11px] font-medium text-gray-800 sm:text-[12px]">
                        {item.label}
                      </span>
                      {isTop && (
                        <span 
                          className="shrink-0 rounded-full bg-teal-50 px-1 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-teal-600 sm:px-1.5 sm:text-[8px]"
                          aria-label="Highest spending category"
                        >
                          Top
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span 
                        className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${item.color}`}
                        aria-hidden="true"
                      />
                      <span className="text-[9px] text-gray-500 sm:text-[10px]">
                        {percent.toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount - RESPONSIVE */}
                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-semibold text-gray-900 sm:text-[12px]">
                    {formatCurrency(item.amount, currency, locale)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fade gradient */}
        {categories.length > 4 && (
          <div 
            className="pointer-events-none absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent sm:h-8"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ─── Footer Insight - RESPONSIVE ─── */}
      {showFooter && topCategory && total > 0 && (
        <div 
          className="mt-2.5 rounded-md bg-white/70 px-2 py-1.5 text-[10px] text-gray-600 sm:mt-3 sm:px-2.5 sm:py-2 sm:text-[11px]"
          role="note"
          aria-label="Spending insight"
        >
          <span className="font-medium text-gray-800">{topCategory.label}</span>{" "}
          is your highest spending category this {periodLabel}, taking up{" "}
          <span className="font-medium text-gray-800">
            {calculatePercentage(topCategory.amount, total).toFixed(1)}%
          </span>{" "}
          of your total spending.
        </div>
      )}
    </div>
  );
}

SpendingBreakdownList.displayName = "SpendingBreakdownList";