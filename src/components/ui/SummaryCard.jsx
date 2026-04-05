// src/components/dashboard/SummaryCard.jsx
"use client";

import React, { useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ArrowDown,
  ArrowUp,
  Landmark,
} from "lucide-react";

const iconMap = {
  wallet: Wallet,
  income: ArrowDown,
  expense: ArrowUp,
  asset: Landmark,
};

const DEFAULT_SEGMENT_COLORS = [
  { bg: "bg-emerald-500", text: "text-emerald-700" },
  { bg: "bg-blue-500", text: "text-blue-700" },
  { bg: "bg-amber-500", text: "text-amber-700" },
  { bg: "bg-purple-500", text: "text-purple-700" },
  { bg: "bg-rose-500", text: "text-rose-700" },
];

function formatCurrency(value, currency = "₹", locale = "en-IN") {
  const num = Number(value);
  if (isNaN(num)) return `${currency}0`;
  
  if (Math.abs(num) >= 10000000) {
    return `${currency}${(num / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `${currency}${(num / 100000).toFixed(2)}L`;
  }
  
  return `${currency}${num.toLocaleString(locale)}`;
}

function formatChange(change) {
  const num = Number(change);
  if (isNaN(num)) return null;
  const formatted = Math.abs(num).toFixed(1);
  return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
}

export default function SummaryCard({
  title,
  amount = 0,
  change,
  changeType = "positive",
  segments = [],
  footer,
  icon = "wallet",
  currency = "₹",
  locale = "en-IN",
  showChange = true,
  showFooter = true,
  isLoading = false,
  onClick,
  className = "",
}) {
  const Icon = iconMap[icon] || Wallet;

  const normalizedSegments = useMemo(() => {
    if (!Array.isArray(segments)) return [];
    
    return segments
      .filter((seg) => seg && typeof seg === "object")
      .map((seg, index) => ({
        id: seg.id || `segment-${index}`,
        label: seg.label || `Segment ${index + 1}`,
        value: Math.max(0, Math.min(100, Number(seg.value) || 0)),
        bg: seg.bg || DEFAULT_SEGMENT_COLORS[index % DEFAULT_SEGMENT_COLORS.length].bg,
        color: seg.color || seg.bg || DEFAULT_SEGMENT_COLORS[index % DEFAULT_SEGMENT_COLORS.length].bg,
      }));
  }, [segments]);

  const totalUsed = useMemo(() => {
    return normalizedSegments.reduce((sum, seg) => sum + seg.value, 0);
  }, [normalizedSegments]);

  const remaining = Math.max(0, 100 - totalUsed);
  const validChangeType = changeType === "negative" ? "negative" : "positive";
  const formattedChange = formatChange(change);
  const shouldShowChange = showChange && formattedChange !== null;
  const isInteractive = typeof onClick === "function";

  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING SKELETON - Responsive
  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div 
        className={`w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4 ${className}`}
        aria-busy="true"
        aria-label="Loading summary card"
      >
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-4" />
          <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-24" />
        </div>
        <div className="mt-2.5 h-7 w-28 animate-pulse rounded bg-gray-200 sm:mt-3 sm:h-8 sm:w-32 lg:h-9 lg:w-36" />
        <div className="mt-2.5 h-2 w-full animate-pulse rounded-full bg-gray-200 sm:mt-3" />
        <div className="mt-2 flex gap-3 sm:gap-4">
          <div className="h-3 w-14 animate-pulse rounded bg-gray-200 sm:w-16" />
          <div className="h-3 w-14 animate-pulse rounded bg-gray-200 sm:w-16" />
        </div>
      </div>
    );
  }

  const CardWrapper = isInteractive ? "button" : "div";
  const cardProps = isInteractive
    ? {
        type: "button",
        onClick,
        className: `w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4 text-left transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`,
      }
    : {
        className: `w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3 sm:p-3.5 lg:p-4 ${className}`,
      };

  return (
    <CardWrapper {...cardProps} aria-label={`${title}: ${formatCurrency(amount, currency, locale)}`}>
      {/* ─── Header ─── */}
      <div className="flex items-center gap-1.5 text-gray-600 sm:gap-2">
        <Icon 
          size={14} 
          className="shrink-0 text-gray-700 sm:h-[15px] sm:w-[15px]" 
          aria-hidden="true"
        />
        <span className="text-xs font-medium sm:text-[13px]">{title}</span>
      </div>

      {/* ─── Amount + Change ─── */}
      <div className="mt-2.5 flex items-end justify-between gap-2 sm:mt-3 sm:gap-3">
        {/* Amount - Responsive text size */}
        <h2 className="text-[26px] font-semibold leading-none tracking-tight text-gray-900 sm:text-[28px] md:text-[30px] lg:text-[32px]">
          {formatCurrency(amount, currency, locale)}
        </h2>

        {/* Change Badge - Responsive */}
        {shouldShowChange && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:gap-1 sm:px-2 sm:text-[11px] ${
              validChangeType === "positive"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
            role="status"
            aria-label={`${validChangeType === "positive" ? "Increased" : "Decreased"} by ${formattedChange} percent`}
          >
            {validChangeType === "positive" ? (
              <ArrowUpRight size={11} className="sm:h-3 sm:w-3" aria-hidden="true" />
            ) : (
              <ArrowDownRight size={11} className="sm:h-3 sm:w-3" aria-hidden="true" />
            )}
            {formattedChange}%
          </span>
        )}
      </div>

      {/* ─── Progress Bar ─── */}
      {normalizedSegments.length > 0 && (
        <div className="mt-2.5 sm:mt-3">
          {/* Progress Track */}
          <div
            className="flex w-full items-center gap-0.5 overflow-hidden rounded-full bg-gray-100 p-[2px]"
            role="progressbar"
            aria-label={`${title} breakdown`}
            aria-valuenow={totalUsed}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {normalizedSegments.map((seg) => (
              <div
                key={seg.id}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out sm:h-2 ${seg.bg}`}
                style={{ 
                  width: `${seg.value}%`,
                  minWidth: seg.value > 0 ? "4px" : "0px",
                }}
                title={`${seg.label}: ${seg.value.toFixed(1)}%`}
              />
            ))}

            {remaining > 0 && (
              <div
                className="h-1.5 rounded-full bg-gray-200 transition-all duration-500 ease-out sm:h-2"
                style={{ width: `${remaining}%` }}
                title={`Remaining: ${remaining.toFixed(1)}%`}
              />
            )}
          </div>

          {/* Legend - Responsive layout */}
          <div 
            className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-700 sm:mt-2.5 sm:gap-x-4 sm:gap-y-1.5 sm:text-[11px]"
            role="list"
            aria-label="Breakdown legend"
          >
            {normalizedSegments.map((seg) => (
              <span 
                key={seg.id} 
                className="flex items-center gap-1 sm:gap-1.5"
                role="listitem"
              >
                <span 
                  className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${seg.bg}`}
                  aria-hidden="true"
                />
                <span className="truncate">{seg.label}</span>
                <span className="text-gray-400">({seg.value.toFixed(0)}%)</span>
              </span>
            ))}
            
            {remaining > 0 && (
              <span 
                className="flex items-center gap-1 text-gray-500 sm:gap-1.5"
                role="listitem"
              >
                <span 
                  className="h-1.5 w-1.5 rounded-full bg-gray-200 sm:h-2 sm:w-2"
                  aria-hidden="true"
                />
                <span>Remaining</span>
                <span className="text-gray-400">({remaining.toFixed(0)}%)</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {normalizedSegments.length === 0 && segments && segments.length === 0 && (
        <div className="mt-2.5 rounded-md bg-gray-100/50 px-2.5 py-1.5 text-center text-[10px] text-gray-500 sm:mt-3 sm:px-3 sm:py-2 sm:text-[11px]">
          No breakdown data available
        </div>
      )}

      {/* ─── Footer ─── */}
      {showFooter && footer && (
        <div className="mt-2.5 rounded-md bg-white/70 px-2 py-1.5 text-[10px] text-gray-600 sm:mt-3 sm:px-2.5 sm:py-2 sm:text-[11px]">
          {typeof footer === "string" ? footer : footer}
        </div>
      )}
    </CardWrapper>
  );
}

SummaryCard.displayName = "SummaryCard";