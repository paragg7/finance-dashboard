// src/components/dashboard/SummaryCard.jsx
import React from "react";
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

export default function SummaryCard({
  title,
  amount = 0,
  change,
  changeType = "positive",
  segments = [],
  footer,
  icon = "wallet",
  currency = "₹",
  showChange = true,
  showFooter = true,
}) {
  const Icon = iconMap[icon] || Wallet;

  const safeSegments = Array.isArray(segments) ? segments : [];
  const totalUsed = safeSegments.reduce((sum, seg) => sum + (seg.value || 0), 0);
  const remaining = Math.max(0, 100 - totalUsed);

  return (
    <div className="w-full rounded-lg border border-gray-200/80 bg-gray-50 p-3.5">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={15} className="shrink-0 text-gray-700" />
        <span className="text-[13px] font-medium">{title}</span>
      </div>

      {/* Amount + Change */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <h2 className="text-[32px] font-semibold leading-none tracking-tight text-gray-900">
          {currency}
          {Number(amount).toLocaleString()}
        </h2>

        {showChange && typeof change !== "undefined" && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              changeType === "positive"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {change}%
          </span>
        )}
      </div>

      {/* Progress */}
      {safeSegments.length > 0 && (
        <div className="mt-3">
          <div className="flex w-full items-center gap-1 rounded-full bg-gray-200/80 p-[2px]">
            {safeSegments.map((seg, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full ${seg.bg}`}
                style={{ width: `${seg.value}%` }}
              />
            ))}

            {remaining > 0 && (
              <div
                className="h-1.5 rounded-full bg-gray-200"
                style={{ width: `${remaining}%` }}
              />
            )}
          </div>

          {/* Labels */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-700">
            {safeSegments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${seg.bg}`} />
                {seg.label}
              </span>
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