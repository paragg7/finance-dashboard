// src/components/dashboard/SummaryCard.jsx
import React, { useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ArrowDown,
  ArrowUp,
  Landmark,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const iconMap = {
  wallet: Wallet,
  income: ArrowDown,
  expense: ArrowUp,
  asset: Landmark,
};

// Default segment colors with accessible contrast
const DEFAULT_SEGMENT_COLORS = [
  { bg: "bg-emerald-500", text: "text-emerald-700" },
  { bg: "bg-blue-500", text: "text-blue-700" },
  { bg: "bg-amber-500", text: "text-amber-700" },
  { bg: "bg-purple-500", text: "text-purple-700" },
  { bg: "bg-rose-500", text: "text-rose-700" },
];

/**
 * Formats a number as currency with proper localization
 */
function formatCurrency(value, currency = "₹", locale = "en-IN") {
  const num = Number(value);
  
  if (isNaN(num)) return `${currency}0`;
  
  // Handle large numbers with abbreviations
  if (Math.abs(num) >= 10000000) {
    return `${currency}${(num / 10000000).toFixed(2)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `${currency}${(num / 100000).toFixed(2)}L`;
  }
  
  return `${currency}${num.toLocaleString(locale)}`;
}

/**
 * Formats change percentage with validation
 */
function formatChange(change) {
  const num = Number(change);
  if (isNaN(num)) return null;
  
  // Limit decimal places
  const formatted = Math.abs(num).toFixed(1);
  // Remove trailing .0
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

  // Validate and normalize segments
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

  // Calculate remaining percentage
  const totalUsed = useMemo(() => {
    return normalizedSegments.reduce((sum, seg) => sum + seg.value, 0);
  }, [normalizedSegments]);

  const remaining = Math.max(0, 100 - totalUsed);

  // Validate changeType
  const validChangeType = changeType === "negative" ? "negative" : "positive";
  
  // Format change value
  const formattedChange = formatChange(change);
  const shouldShowChange = showChange && formattedChange !== null;

  // Determine if component is interactive
  const isInteractive = typeof onClick === "function";

  // Loading skeleton
  if (isLoading) {
    return (
      <div 
        className={`w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5 ${className}`}
        aria-busy="true"
        aria-label="Loading summary card"
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-3 h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-gray-200" />
        <div className="mt-2 flex gap-4">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  const CardWrapper = isInteractive ? "button" : "div";
  const cardProps = isInteractive
    ? {
        type: "button",
        onClick,
        className: `w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5 text-left transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`,
      }
    : {
        className: `w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5 ${className}`,
      };

  return (
    <CardWrapper {...cardProps} aria-label={`${title}: ${formatCurrency(amount, currency, locale)}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-600">
        <Icon 
          size={15} 
          className="shrink-0 text-gray-700" 
          aria-hidden="true"
        />
        <span className="text-[13px] font-medium">{title}</span>
      </div>

      {/* Amount + Change */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <h2 className="text-[32px] font-semibold leading-none tracking-tight text-gray-900">
          {formatCurrency(amount, currency, locale)}
        </h2>

        {shouldShowChange && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
              validChangeType === "positive"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
            role="status"
            aria-label={`${validChangeType === "positive" ? "Increased" : "Decreased"} by ${formattedChange} percent`}
          >
            {validChangeType === "positive" ? (
              <ArrowUpRight size={12} aria-hidden="true" />
            ) : (
              <ArrowDownRight size={12} aria-hidden="true" />
            )}
            {formattedChange}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {normalizedSegments.length > 0 && (
        <div className="mt-3">
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
                className={`h-2 rounded-full transition-all duration-500 ease-out ${seg.bg}`}
                style={{ 
                  width: `${seg.value}%`,
                  minWidth: seg.value > 0 ? "4px" : "0px",
                }}
                title={`${seg.label}: ${seg.value.toFixed(1)}%`}
              />
            ))}

            {remaining > 0 && (
              <div
                className="h-2 rounded-full bg-gray-200 transition-all duration-500 ease-out"
                style={{ width: `${remaining}%` }}
                title={`Remaining: ${remaining.toFixed(1)}%`}
              />
            )}
          </div>

          {/* Legend */}
          <div 
            className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-gray-700"
            role="list"
            aria-label="Breakdown legend"
          >
            {normalizedSegments.map((seg) => (
              <span 
                key={seg.id} 
                className="flex items-center gap-1.5"
                role="listitem"
              >
                <span 
                  className={`h-2 w-2 rounded-full ${seg.bg}`}
                  aria-hidden="true"
                />
                <span>{seg.label}</span>
                <span className="text-gray-400">({seg.value.toFixed(0)}%)</span>
              </span>
            ))}
            
            {remaining > 0 && (
              <span 
                className="flex items-center gap-1.5 text-gray-500"
                role="listitem"
              >
                <span 
                  className="h-2 w-2 rounded-full bg-gray-200"
                  aria-hidden="true"
                />
                <span>Remaining</span>
                <span className="text-gray-400">({remaining.toFixed(0)}%)</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Empty State for Segments */}
      {normalizedSegments.length === 0 && segments && segments.length === 0 && (
        <div className="mt-3 rounded-md bg-gray-100/50 px-3 py-2 text-center text-[11px] text-gray-500">
          No breakdown data available
        </div>
      )}

      {/* Footer */}
      {showFooter && footer && (
        <div className="mt-3 rounded-md bg-white/70 px-2.5 py-2 text-[11px] text-gray-600">
          {typeof footer === "string" ? footer : footer}
        </div>
      )}
    </CardWrapper>
  );
}

// Optional: Add display name for debugging
SummaryCard.displayName = "SummaryCard";