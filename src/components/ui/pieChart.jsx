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

// Extended icon map with more categories
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
  // Default fallback
  default: Receipt,
};

// Default colors for categories without specified colors
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

// Period labels for different ranges
const PERIOD_LABELS = {
  monthly: "month",
  quarterly: "quarter",
  yearly: "year",
};

// Scrollbar styles as a string for injection
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
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }
`;

/**
 * Safely calculates percentage, avoiding division by zero
 */
function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Formats currency with locale support
 */
function formatCurrency(amount, currency = "₹", locale = "en-IN") {
  const num = Number(amount);
  if (isNaN(num)) return `${currency}0`;
  
  // Handle large numbers (Indian numbering system)
  if (Math.abs(num) >= 10000000) {
    return `${currency}${(num / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `${currency}${(num / 100000).toFixed(2)}L`;
  }
  
  return `${currency}${num.toLocaleString(locale)}`;
}

/**
 * Validates and normalizes category data
 */
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
  
  // Generate unique IDs for accessibility
  const selectId = useId();
  const listId = useId();

  // Normalize and validate categories
  const categories = useMemo(() => {
    const rawCategories = data?.[range] || data?.monthly || [];
    return normalizeCategories(rawCategories);
  }, [data, range]);

  // Calculate total spending
  const total = useMemo(() => {
    return categories.reduce((sum, item) => sum + item.amount, 0);
  }, [categories]);

  // Find top spending category
  const topCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.reduce((top, current) => 
      current.amount > (top?.amount || 0) ? current : top
    , null);
  }, [categories]);

  // Determine active/selected category
  const activeCategory = useMemo(() => {
    if (!categories.length) return null;
    if (selectedCategory) {
      const found = categories.find((item) => item.id === selectedCategory);
      if (found) return found;
    }
    return topCategory;
  }, [categories, selectedCategory, topCategory]);

  // Get period label
  const periodLabel = PERIOD_LABELS[range] || "month";

  // Handle range change
  const handleRangeChange = useCallback((e) => {
    setRange(e.target.value);
    setSelectedCategory(null);
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect?.(categoryId);
  }, [onCategorySelect]);

  // Handle keyboard navigation
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

  // Loading skeleton
  if (isLoading) {
    return (
      <div 
        className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5"
        aria-busy="true"
        aria-label="Loading spending breakdown"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-3">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-gray-200" />
        <div className="mt-3 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-2 w-12 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[13px] font-medium text-gray-900">{title}</h3>
          <div className="relative w-full shrink-0 sm:w-[110px]">
            <label htmlFor={selectId} className="sr-only">
              Select time range
            </label>
            <select
              id={selectId}
              value={range}
              onChange={handleRangeChange}
              className="h-7 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-6 text-[11px] text-gray-700 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-center py-6 text-center">
          <Receipt size={32} className="text-gray-300" aria-hidden="true" />
          <p className="mt-2 text-sm text-gray-500">No spending data available</p>
          <p className="mt-1 text-xs text-gray-400">
            Add transactions to see your spending breakdown
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Inject scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[13px] font-medium text-gray-900">{title}</h3>

        <div className="relative w-full shrink-0 sm:w-[110px]">
          <label htmlFor={selectId} className="sr-only">
            Select time range
          </label>
          <select
            id={selectId}
            value={range}
            onChange={handleRangeChange}
            className="h-7 w-full appearance-none rounded-md border border-gray-200 bg-white px-2 pr-6 text-[11px] text-gray-700 outline-none transition-colors focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Total Amount */}
      <div className="mt-3">
        <div 
          className="text-[26px] font-semibold leading-none tracking-tight text-gray-900"
          aria-label={`Total spent: ${formatCurrency(total, currency, locale)}`}
        >
          {formatCurrency(total, currency, locale)}
        </div>
        <div className="mt-1 text-[12px] text-gray-500">
          Total spent this {periodLabel}
        </div>
      </div>

      {/* Combined Progress Bar */}
      <div 
        className="mt-3 flex w-full items-center gap-0.5 overflow-hidden rounded-full bg-gray-200/80 p-[2px]"
        role="img"
        aria-label={`Spending breakdown across ${categories.length} categories`}
      >
        {categories.map((item) => {
          const percent = calculatePercentage(item.amount, total);
          
          return (
            <div
              key={item.id}
              className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
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

      {/* Category List */}
      <div className="relative mt-3">
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
                className={`group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 ${
                  isActive
                    ? "border border-gray-200 bg-white shadow-sm"
                    : "border border-transparent hover:border-gray-100 hover:bg-white/80"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {/* Icon */}
                  <div 
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isActive 
                        ? "border-gray-300 bg-gray-50" 
                        : "border-gray-200 bg-white group-hover:border-gray-300"
                    }`}
                  >
                    <Icon 
                      size={14} 
                      className="text-gray-700" 
                      aria-hidden="true"
                    />
                  </div>

                  {/* Label & Percentage */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-medium text-gray-800">
                        {item.label}
                      </span>
                      {isTop && (
                        <span 
                          className="shrink-0 rounded-full bg-teal-50 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-teal-600"
                          aria-label="Highest spending category"
                        >
                          Top
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className={`h-1.5 w-1.5 rounded-full ${item.color}`}
                        aria-hidden="true"
                      />
                      <span className="text-[10px] text-gray-500">
                        {percent.toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  <div className="text-[12px] font-semibold text-gray-900">
                    {formatCurrency(item.amount, currency, locale)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fade gradient - only show if content overflows */}
        {categories.length > 4 && (
          <div 
            className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Footer Insight */}
      {showFooter && topCategory && total > 0 && (
        <div 
          className="mt-3 rounded-md bg-white/70 px-2.5 py-2 text-[11px] text-gray-600"
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

// Display name for debugging
SpendingBreakdownList.displayName = "SpendingBreakdownList";