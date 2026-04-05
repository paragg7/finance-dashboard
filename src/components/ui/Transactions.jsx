// src/components/dashboard/Transactions.jsx
"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useId,
  useEffect,
  useRef,
} from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  MoreVertical,
  CreditCard,
  Wallet,
  Receipt,
  X,
  Check,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  FileJson,
  FileText,
} from "lucide-react";

// ─── Scrollbar styles ─────────────────────────────────────────────────────────
const scrollbarStyles = `
  .txn-scrollbar::-webkit-scrollbar { width: 4px; }
  .txn-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .txn-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 20px;
  }
  .txn-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
  .txn-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
`;

// ─── Sample Data ──────────────────────────────────────────────────────────────
const ALL_TRANSACTIONS = [
  {
    id: 1,
    name: "Figma Team",
    date: "2023-07-25T14:18:00",
    dateDisplay: "Jul 25, 2023, 2:18 PM",
    category: "Subscriptions",
    wallet: "Main Wallet",
    status: "pending",
    type: "expense",
    amount: -47.83,
    iconBg: "bg-violet-500",
    iconText: "F",
  },
  {
    id: 2,
    name: "Apple One Premier",
    date: "2023-07-23T10:38:00",
    dateDisplay: "Jul 23, 2023, 10:38 AM",
    category: "Subscriptions",
    wallet: "Wallet",
    status: "completed",
    type: "expense",
    amount: -32.5,
    iconBg: "bg-gray-900",
    iconText: "A",
  },
  {
    id: 3,
    name: "Starbucks Morning",
    date: "2023-07-22T23:45:00",
    dateDisplay: "Jul 22, 2023, 11:45 PM",
    category: "Food & Drink",
    wallet: "Main Wallet",
    status: "completed",
    type: "expense",
    amount: -12.5,
    iconBg: "bg-emerald-600",
    iconText: "S",
  },
  {
    id: 4,
    name: "Netflix Family",
    date: "2023-07-20T23:49:00",
    dateDisplay: "Jul 20, 2023, 11:49 PM",
    category: "Subscriptions",
    wallet: "Wallet",
    status: "completed",
    type: "expense",
    amount: -19.99,
    iconBg: "bg-red-600",
    iconText: "N",
  },
  {
    id: 5,
    name: "Spotify Duo",
    date: "2023-07-18T23:49:00",
    dateDisplay: "Jul 18, 2023, 11:49 PM",
    category: "Subscriptions",
    wallet: "Main Wallet",
    status: "pending",
    type: "expense",
    amount: -14.99,
    iconBg: "bg-green-500",
    iconText: "S",
  },
  {
    id: 6,
    name: "Adobe Creative",
    date: "2023-07-17T09:00:00",
    dateDisplay: "Jul 17, 2023, 9:00 AM",
    category: "Subscriptions",
    wallet: "Main Wallet",
    status: "completed",
    type: "expense",
    amount: -54.99,
    iconBg: "bg-red-500",
    iconText: "A",
  },
  {
    id: 7,
    name: "GitHub Pro",
    date: "2023-07-15T08:00:00",
    dateDisplay: "Jul 15, 2023, 8:00 AM",
    category: "Subscriptions",
    wallet: "Wallet",
    status: "completed",
    type: "expense",
    amount: -4.0,
    iconBg: "bg-gray-800",
    iconText: "G",
  },
  {
    id: 8,
    name: "Freelance Payment",
    date: "2023-07-14T10:00:00",
    dateDisplay: "Jul 14, 2023, 10:00 AM",
    category: "Income",
    wallet: "Main Wallet",
    status: "completed",
    type: "income",
    amount: 1500.0,
    iconBg: "bg-emerald-500",
    iconText: "F",
  },
  {
    id: 9,
    name: "Salary Deposit",
    date: "2023-07-01T09:00:00",
    dateDisplay: "Jul 1, 2023, 9:00 AM",
    category: "Income",
    wallet: "Main Wallet",
    status: "completed",
    type: "income",
    amount: 4200.0,
    iconBg: "bg-blue-500",
    iconText: "S",
  },
  {
    id: 10,
    name: "AWS Services",
    date: "2023-07-10T08:00:00",
    dateDisplay: "Jul 10, 2023, 8:00 AM",
    category: "Technology",
    wallet: "Main Wallet",
    status: "completed",
    type: "expense",
    amount: -89.5,
    iconBg: "bg-orange-500",
    iconText: "A",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Newest first", value: "date-desc", icon: Calendar },
  { label: "Oldest first", value: "date-asc", icon: Calendar },
  { label: "Highest amount", value: "amount-desc", icon: TrendingUp },
  { label: "Lowest amount", value: "amount-asc", icon: TrendingDown },
  { label: "Name A–Z", value: "name-asc", icon: null },
  { label: "Name Z–A", value: "name-desc", icon: null },
];

const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];

const TYPE_FILTER_OPTIONS = [
  { label: "All types", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const EXPORT_OPTIONS = [
  { label: "Export as CSV", value: "csv", icon: FileText },
  { label: "Export as JSON", value: "json", icon: FileJson },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAmount(amount, currency = "$") {
  const num = Number(amount);
  if (isNaN(num)) return `${currency}0.00`;
  const abs = Math.abs(num).toFixed(2);
  return num < 0 ? `-${currency}${abs}` : `+${currency}${abs}`;
}

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function resolveType(txn) {
  if (txn.type === "income" || txn.type === "expense") return txn.type;
  return (txn.amount || 0) >= 0 ? "income" : "expense";
}

// ─── Export utilities ─────────────────────────────────────────────────────────
function exportToCSV(data, filename = "transactions.csv") {
  const headers = [
    "ID",
    "Name",
    "Date",
    "Category",
    "Wallet",
    "Type",
    "Status",
    "Amount",
  ];

  const rows = data.map((t) => [
    t.id,
    `"${(t.name || "").replace(/"/g, '""')}"`,
    t.dateDisplay || t.date,
    `"${(t.category || "").replace(/"/g, '""')}"`,
    `"${(t.wallet || "").replace(/"/g, '""')}"`,
    resolveType(t),
    t.status || "",
    (t.amount || 0).toFixed(2),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  triggerDownload(
    new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
    filename
  );
}

function exportToJSON(data, filename = "transactions.json") {
  const cleaned = data.map((t) => ({
    id: t.id,
    name: t.name,
    date: t.dateDisplay || t.date,
    category: t.category,
    wallet: t.wallet,
    type: resolveType(t),
    status: t.status,
    amount: t.amount,
  }));

  triggerDownload(
    new Blob([JSON.stringify(cleaned, null, 2)], {
      type: "application/json",
    }),
    filename
  );
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useClickOutside(ref, handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, isActive]);
}

function useEscapeKey(handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    const listener = (e) => {
      if (e.key === "Escape") handler(e);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [handler, isActive]);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TransactionAvatar({ iconBg, iconText, name }) {
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${iconBg}`}
      aria-hidden="true"
      title={name}
    >
      <span className="select-none text-xs font-bold text-white sm:text-[13px]">
        {iconText}
      </span>
    </div>
  );
}

function TypeBadge({ type }) {
  const isIncome = type === "income";
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium capitalize sm:gap-1 sm:px-2 sm:text-[10px] ${
        isIncome
          ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border border-rose-200 bg-rose-50 text-rose-500"
      }`}
      aria-label={`Type: ${type}`}
    >
      <Icon size={9} className="sm:h-2.5 sm:w-2.5" aria-hidden="true" />
      {capitalizeFirst(type)}
    </span>
  );
}

function StatusBadge({ status }) {
  const isPending = status === "pending";
  const StatusIcon = isPending ? Clock : Check;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium capitalize sm:gap-1 sm:px-2 sm:text-[10px] ${
        isPending
          ? "border border-amber-200 bg-amber-50 text-amber-600"
          : "border border-emerald-200 bg-emerald-50 text-emerald-600"
      }`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <StatusIcon size={9} className="sm:h-2.5 sm:w-2.5" aria-hidden="true" />
      {capitalizeFirst(status)}
    </span>
  );
}

function IconBox({ children, label }) {
  return (
    <div
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white sm:h-6 sm:w-6"
      aria-hidden="true"
      title={label}
    >
      {children}
    </div>
  );
}

function DropdownMenu({
  isOpen,
  onClose,
  options,
  value,
  onChange,
  triggerId,
  label,
  multiSelect = false,
}) {
  const menuRef = useRef(null);
  const menuId = useId();

  useClickOutside(menuRef, onClose, isOpen);
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.querySelector("button")?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e, index) => {
    const buttons = menuRef.current?.querySelectorAll("button");
    if (!buttons) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        buttons[Math.min(index + 1, buttons.length - 1)]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        buttons[Math.max(index - 1, 0)]?.focus();
        break;
      case "Home":
        e.preventDefault();
        buttons[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        buttons[buttons.length - 1]?.focus();
        break;
      case "Tab":
        onClose();
        break;
    }
  };

  return (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={label}
      aria-labelledby={triggerId}
      className="absolute right-0 top-full z-20 mt-1 min-w-[150px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:min-w-[170px]"
    >
      {options.map((opt, index) => {
        const isSelected = multiSelect
          ? Array.isArray(value) && value.includes(opt.value)
          : value === opt.value;
        const Icon = opt.icon;

        return (
          <button
            key={opt.value}
            role="menuitem"
            onClick={() => {
              onChange(opt.value);
              if (!multiSelect) onClose();
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex w-full items-center gap-2 px-3 py-2 text-[11px] transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none sm:text-[12px] ${
              isSelected ? "font-semibold text-gray-900" : "text-gray-600"
            }`}
            aria-current={isSelected ? "true" : undefined}
          >
            {isSelected ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-800"
                aria-hidden="true"
              />
            ) : Icon ? (
              <Icon size={11} className="shrink-0 text-gray-400 sm:h-3 sm:w-3" aria-hidden="true" />
            ) : (
              <span className="w-3 shrink-0" />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function RowContextMenu({ isOpen, onClose, transaction, onAction, position }) {
  const menuRef = useRef(null);

  useClickOutside(menuRef, onClose, isOpen);
  useEscapeKey(onClose, isOpen);

  if (!isOpen || !transaction) return null;

  const actions = [
    { id: "view", label: "View details", icon: ExternalLink },
    { id: "edit", label: "Edit", icon: Edit },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "delete", label: "Delete", icon: Trash2, danger: true },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Actions for ${transaction.name}`}
      className="fixed z-50 min-w-[130px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:min-w-[140px]"
      style={{ top: position.y, left: position.x }}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          role="menuitem"
          onClick={() => {
            onAction(action.id, transaction);
            onClose();
          }}
          className={`flex w-full items-center gap-2 px-3 py-2 text-[11px] transition-colors focus:outline-none sm:text-[12px] ${
            action.danger
              ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
              : "text-gray-600 hover:bg-gray-50 focus:bg-gray-50"
          }`}
        >
          <action.icon size={11} className="sm:h-3 sm:w-3" aria-hidden="true" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

function Checkbox({ checked, onChange, label, indeterminate = false }) {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="relative flex cursor-pointer items-center">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer h-3 w-3 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-colors checked:border-gray-700 checked:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 indeterminate:border-gray-700 indeterminate:bg-gray-700 sm:h-3.5 sm:w-3.5"
        aria-label={label}
      />
      <Check
        size={9}
        className="pointer-events-none absolute left-0.5 top-0.5 hidden text-white peer-checked:block peer-indeterminate:hidden sm:left-[3px] sm:top-[3px] sm:h-2.5 sm:w-2.5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[2px] top-[4px] hidden h-0.5 w-1.5 rounded-full bg-white peer-indeterminate:block sm:left-[3px] sm:top-[5px] sm:w-2"
        aria-hidden="true"
      />
    </label>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-2 px-2 py-2.5 sm:gap-3 sm:px-3 sm:py-3" aria-hidden="true">
      <div className="h-3 w-3 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-4" />
      <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-8 sm:w-8" />
      <div className="flex-1 space-y-1 sm:space-y-1.5">
        <div className="h-2.5 w-24 animate-pulse rounded bg-gray-200 sm:h-3 sm:w-32" />
        <div className="h-2 w-20 animate-pulse rounded bg-gray-200 sm:w-24" />
      </div>
      <div className="hidden h-3 w-16 animate-pulse rounded bg-gray-200 sm:block sm:w-20" />
      <div className="hidden h-4 w-12 animate-pulse rounded-full bg-gray-200 sm:block sm:h-5 sm:w-14" />
      <div className="h-4 w-12 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-16" />
      <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:w-14" />
    </div>
  );
}

function EmptyState({ query, hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
      <div className="rounded-full bg-gray-100 p-2.5 sm:p-3">
        <Receipt size={20} className="text-gray-400 sm:h-6 sm:w-6" aria-hidden="true" />
      </div>
      <p className="mt-2.5 text-xs font-medium text-gray-700 sm:mt-3 sm:text-sm">
        {query ? `No results for "${query}"` : "No transactions found"}
      </p>
      <p className="mt-1 max-w-[220px] text-[10px] text-gray-500 sm:max-w-[240px] sm:text-[11px]">
        {query
          ? "Try a different search term or adjust your filters"
          : hasFilters
          ? "No transactions match your current filters"
          : "Your recent transactions will appear here"}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-2.5 text-[10px] font-medium text-gray-600 underline hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 sm:mt-3 sm:text-[11px]"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function SummaryStrip({ data, currency }) {
  const totals = useMemo(() => {
    return data.reduce(
      (acc, t) => {
        if (resolveType(t) === "income") acc.income += t.amount || 0;
        else acc.expense += Math.abs(t.amount || 0);
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [data]);

  const net = totals.income - totals.expense;

  return (
    <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
      {[
        {
          label: "Total Income",
          value: `+${currency}${totals.income.toFixed(2)}`,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        },
        {
          label: "Total Expenses",
          value: `-${currency}${totals.expense.toFixed(2)}`,
          color: "text-rose-500",
          bg: "bg-rose-50",
          border: "border-rose-100",
        },
        {
          label: "Net Balance",
          value: `${net >= 0 ? "+" : ""}${currency}${net.toFixed(2)}`,
          color: net >= 0 ? "text-emerald-600" : "text-rose-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
        },
      ].map((item) => (
        <div
          key={item.label}
          className={`rounded-lg border ${item.border} ${item.bg} px-2 py-1.5 sm:px-3 sm:py-2`}
        >
          <p className="text-[9px] text-gray-500 sm:text-[10px]">{item.label}</p>
          <p className={`mt-0.5 text-[11px] font-semibold sm:text-[13px] ${item.color}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecentTransactions({
  transactions = ALL_TRANSACTIONS,
  isLoading = false,
  maxHeight = 320,
  currency = "$",
  onRowClick,
  onRowAction,
}) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    transaction: null,
    position: { x: 0, y: 0 },
  });

  const listId = useId();
  const sortButtonId = useId();
  const filterButtonId = useId();
  const typeButtonId = useId();
  const exportButtonId = useId();
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.wallet?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (filterType !== "all") {
      result = result.filter((t) => resolveType(t) === filterType);
    }

    const [sortField, sortDir] = sortOrder.split("-");
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp = parseDate(a.date) - parseDate(b.date);
          break;
        case "amount":
          cmp = Math.abs(a.amount || 0) - Math.abs(b.amount || 0);
          break;
        case "name":
          cmp = (a.name || "").localeCompare(b.name || "");
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [transactions, search, filterStatus, filterType, sortOrder]);

  const allSelected =
    filtered.length > 0 && selectedIds.length === filtered.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < filtered.length;

  const activeFilterCount =
    (filterStatus !== "all" ? 1 : 0) + (filterType !== "all" ? 1 : 0);

  const hasFilters =
    filterStatus !== "all" || filterType !== "all" || search.trim() !== "";

  const exportScope = useMemo(
    () =>
      selectedIds.length > 0
        ? filtered.filter((t) => selectedIds.includes(t.id))
        : filtered,
    [filtered, selectedIds]
  );

  const toggleAll = useCallback(() => {
    setSelectedIds(allSelected ? [] : filtered.map((t) => t.id));
  }, [allSelected, filtered]);

  const toggleRow = useCallback((id, event) => {
    event?.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleRowClick = useCallback(
    (txn) => {
      setActiveId(txn.id);
      onRowClick?.(txn);
    },
    [onRowClick]
  );

  const handleContextMenu = useCallback((event, txn) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      isOpen: true,
      transaction: txn,
      position: {
        x: Math.min(event.clientX, window.innerWidth - 160),
        y: Math.min(event.clientY, window.innerHeight - 200),
      },
    });
  }, []);

  const handleRowAction = useCallback(
    (actionId, txn) => {
      onRowAction?.(actionId, txn);
    },
    [onRowAction]
  );

  const handleExport = useCallback(
    (format) => {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `transactions-${timestamp}`;
      if (format === "csv") exportToCSV(exportScope, `${filename}.csv`);
      else if (format === "json") exportToJSON(exportScope, `${filename}.json`);
      setShowExportMenu(false);
    },
    [exportScope]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setFilterStatus("all");
    setFilterType("all");
    setSortOrder("date-desc");
  }, []);

  const handleKeyDown = useCallback(
    (e, index) => {
      const rows = listRef.current?.querySelectorAll("[data-txn-row]");
      if (!rows) return;
      let targetIndex = index;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          targetIndex = Math.min(index + 1, rows.length - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          targetIndex = Math.max(index - 1, 0);
          break;
        case "Home":
          e.preventDefault();
          targetIndex = 0;
          break;
        case "End":
          e.preventDefault();
          targetIndex = rows.length - 1;
          break;
        case " ":
          e.preventDefault();
          toggleRow(filtered[index]?.id);
          return;
        default:
          return;
      }
      const row = rows[targetIndex];
      if (row) {
        row.focus();
        row.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    },
    [filtered, toggleRow]
  );

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (isLoading) {
    return (
      <div
        className="w-full rounded-xl border border-gray-200/80 bg-gray-50 p-3 sm:p-4"
        aria-busy="true"
        aria-label="Loading transactions"
      >
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-36" />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[120, 70, 70, 70, 28].map((w, i) => (
              <div
                key={i}
                className="h-7 animate-pulse rounded-lg bg-gray-200 sm:h-8"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200 sm:h-14" />
          ))}
        </div>
        <div className="mt-3 hidden items-center border-b border-gray-200 pb-2 sm:flex sm:mt-4">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-gray-200/80 bg-gray-50 p-3 sm:p-4"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      {/* ─── Header ─── */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-900 sm:text-[14px]">
            Recent Transactions
          </h3>
          {selectedIds.length > 0 && (
            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-[11px]">
              {selectedIds.length} of {filtered.length} selected
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Search - RESPONSIVE */}
          <div className="relative flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 transition-all focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100 sm:gap-1.5 sm:px-2.5">
            <Search size={12} className="shrink-0 text-gray-400 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search (⌘F)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[80px] bg-transparent text-[11px] text-gray-700 placeholder-gray-400 outline-none sm:w-[100px] sm:text-[12px] md:w-[120px]"
              aria-label="Search transactions"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X size={11} className="sm:h-3 sm:w-3" />
              </button>
            )}
          </div>

          {/* Sort - RESPONSIVE */}
          <div className="relative">
            <button
              id={sortButtonId}
              onClick={() => {
                setShowSortMenu((p) => !p);
                setShowFilterMenu(false);
                setShowTypeMenu(false);
                setShowExportMenu(false);
              }}
              aria-expanded={showSortMenu}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:gap-1.5 sm:px-2.5 sm:text-[12px]"
            >
              <ArrowUpDown size={12} className="text-gray-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
              <span className="hidden sm:inline">Sort</span>
            </button>
            <DropdownMenu
              isOpen={showSortMenu}
              onClose={() => setShowSortMenu(false)}
              options={SORT_OPTIONS}
              value={sortOrder}
              onChange={setSortOrder}
              triggerId={sortButtonId}
              label="Sort options"
            />
          </div>

          {/* Status Filter - RESPONSIVE */}
          <div className="relative">
            <button
              id={filterButtonId}
              onClick={() => {
                setShowFilterMenu((p) => !p);
                setShowSortMenu(false);
                setShowTypeMenu(false);
                setShowExportMenu(false);
              }}
              aria-expanded={showFilterMenu}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:gap-1.5 sm:px-2.5 sm:text-[12px]"
            >
              <SlidersHorizontal size={12} className="text-gray-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-800 text-[8px] font-bold text-white sm:h-4 sm:w-4 sm:text-[9px]"
                  aria-label={`${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            <DropdownMenu
              isOpen={showFilterMenu}
              onClose={() => setShowFilterMenu(false)}
              options={STATUS_FILTER_OPTIONS}
              value={filterStatus}
              onChange={setFilterStatus}
              triggerId={filterButtonId}
              label="Filter by status"
            />
          </div>

          {/* Type Filter - RESPONSIVE */}
          <div className="relative">
            <button
              id={typeButtonId}
              onClick={() => {
                setShowTypeMenu((p) => !p);
                setShowSortMenu(false);
                setShowFilterMenu(false);
                setShowExportMenu(false);
              }}
              aria-expanded={showTypeMenu}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:gap-1.5 sm:px-2.5 sm:text-[12px]"
            >
              {filterType === "income" ? (
                <ArrowDownLeft size={12} className="text-emerald-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
              ) : filterType === "expense" ? (
                <ArrowUpRight size={12} className="text-rose-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
              ) : (
                <TrendingUp size={12} className="text-gray-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {filterType === "all" ? "Type" : capitalizeFirst(filterType)}
              </span>
            </button>
            <DropdownMenu
              isOpen={showTypeMenu}
              onClose={() => setShowTypeMenu(false)}
              options={TYPE_FILTER_OPTIONS}
              value={filterType}
              onChange={setFilterType}
              triggerId={typeButtonId}
              label="Filter by type"
            />
          </div>

          {/* Export - RESPONSIVE */}
          <div className="relative">
            <button
              id={exportButtonId}
              onClick={() => {
                setShowExportMenu((p) => !p);
                setShowSortMenu(false);
                setShowFilterMenu(false);
                setShowTypeMenu(false);
              }}
              aria-expanded={showExportMenu}
              aria-haspopup="menu"
              className="flex h-[26px] w-[26px] items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 sm:h-[30px] sm:w-[30px]"
              aria-label="Export transactions"
              title={`Export ${exportScope.length} transaction${exportScope.length !== 1 ? "s" : ""}`}
            >
              <Download size={12} className="text-gray-500 sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
            </button>
            <DropdownMenu
              isOpen={showExportMenu}
              onClose={() => setShowExportMenu(false)}
              options={EXPORT_OPTIONS}
              value=""
              onChange={handleExport}
              triggerId={exportButtonId}
              label="Export options"
            />
          </div>
        </div>
      </div>

      {/* ─── Summary Strip ─── */}
      <SummaryStrip data={filtered} currency={currency} />

      {/* ─── Column Headers (Desktop) ─── */}
      <div
        className="mt-2.5 hidden items-center gap-2 border-b border-gray-200 px-2 pb-2 sm:grid sm:mt-3 sm:gap-3"
        style={{
          gridTemplateColumns: "auto 1fr auto auto auto auto auto auto",
        }}
        role="row"
        aria-hidden="true"
      >
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleAll}
          label="Select all transactions"
        />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Transaction
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Category
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Wallet
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Type
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Status
        </span>
        <span className="text-right text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-[11px]">
          Amount
        </span>
        <span className="w-5 sm:w-6" aria-hidden="true" />
      </div>

      {/* ─── Mobile Select All ─── */}
      <div className="mt-2.5 flex items-center gap-2 border-b border-gray-200 px-2 pb-2 sm:hidden">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onChange={toggleAll}
          label="Select all transactions"
        />
        <span className="text-[10px] text-gray-500">
          {allSelected ? "Deselect all" : "Select all"}
        </span>
      </div>

      {/* ─── Transaction Rows - RESPONSIVE GRID ─── */}
      <div className="relative mt-1">
        <div
          ref={listRef}
          className="txn-scrollbar overflow-y-auto"
          style={{ maxHeight: `${maxHeight}px` }}
          role="listbox"
          aria-label="Transaction list"
          aria-multiselectable="true"
          data-txn-list={listId}
        >
          {filtered.length === 0 ? (
            <EmptyState
              query={search}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />
          ) : (
            filtered.map((txn, index) => {
              const isSelected = selectedIds.includes(txn.id);
              const isActive = activeId === txn.id;
              const txnType = resolveType(txn);

              return (
                <div
                  key={txn.id}
                  data-txn-row
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => handleRowClick(txn)}
                  onContextMenu={(e) => handleContextMenu(e, txn)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`group grid w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-300 sm:gap-3 sm:py-2.5 ${
                    isActive
                      ? "border border-gray-200 bg-white"
                      : "border border-transparent hover:border-gray-100 hover:bg-white/80"
                  }`}
                  style={{
                    gridTemplateColumns:
                      "auto 1fr auto auto auto auto auto auto",
                  }}
                >
                  {/* Checkbox */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => toggleRow(txn.id, e)}
                      label={`Select ${txn.name}`}
                    />
                  </div>

                  {/* Name + Date */}
                  <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                    <TransactionAvatar
                      iconBg={txn.iconBg}
                      iconText={txn.iconText}
                      name={txn.name}
                    />
                    <div className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold text-gray-800 sm:text-[12px]">
                        {txn.name}
                      </span>
                      <span className="block truncate text-[9px] text-gray-400 sm:text-[10px]">
                        {txn.dateDisplay || txn.date}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
                    <IconBox label="Category">
                      <CreditCard size={10} className="text-gray-500 sm:h-[11px] sm:w-[11px]" aria-hidden="true" />
                    </IconBox>
                    <span className="text-[10px] text-gray-600 sm:text-[11px]">
                      {txn.category}
                    </span>
                  </div>

                  {/* Wallet */}
                  <div className="hidden items-center gap-1 md:flex sm:gap-1.5">
                    <IconBox label="Wallet">
                      <Wallet size={10} className="text-gray-500 sm:h-[11px] sm:w-[11px]" aria-hidden="true" />
                    </IconBox>
                    <span className="text-[10px] text-gray-600 sm:text-[11px]">
                      {txn.wallet}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="hidden sm:block">
                    <TypeBadge type={txnType} />
                  </div>

                  {/* Status */}
                  <StatusBadge status={txn.status} />

                  {/* Amount - RESPONSIVE */}
                  <span
                    className={`whitespace-nowrap text-right text-[11px] font-semibold sm:text-[12px] ${
                      (txn.amount || 0) < 0
                        ? "text-rose-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {formatAmount(txn.amount, currency)}
                  </span>

                  {/* More options */}
                  <button
                    type="button"
                    onClick={(e) => handleContextMenu(e, txn)}
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-transparent text-gray-400 opacity-0 transition-all hover:border-gray-200 hover:bg-white focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:h-6 sm:w-6"
                    aria-label={`More options for ${txn.name}`}
                    aria-haspopup="menu"
                  >
                    <MoreVertical size={12} className="sm:h-[13px] sm:w-[13px]" aria-hidden="true" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Fade gradient */}
        {filtered.length > 5 && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent sm:h-10"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Context Menu */}
      <RowContextMenu
        isOpen={contextMenu.isOpen}
        onClose={() =>
          setContextMenu((prev) => ({ ...prev, isOpen: false }))
        }
        transaction={contextMenu.transaction}
        onAction={handleRowAction}
        position={contextMenu.position}
      />

      {/* ─── Footer - RESPONSIVE ─── */}
      {filtered.length > 0 && (
        <div
          className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/70 px-2.5 py-2 text-[10px] text-gray-600 sm:mt-3 sm:px-3 sm:text-[11px]"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-1">
            <span>
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filtered.length}
              </span>{" "}
              transaction{filtered.length !== 1 ? "s" : ""}
            </span>
            {selectedIds.length > 0 && (
              <span>
                {" · "}
                <span className="font-semibold text-gray-800">
                  {selectedIds.length}
                </span>{" "}
                selected
              </span>
            )}
            {hasFilters && (
              <span>
                {" · "}
                <button
                  onClick={clearFilters}
                  className="font-medium text-gray-600 underline hover:text-gray-800"
                >
                  Clear filters
                </button>
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="font-medium">
              Selected total:{" "}
              <span
                className={
                  filtered
                    .filter((t) => selectedIds.includes(t.id))
                    .reduce((s, t) => s + (t.amount || 0), 0) < 0
                    ? "text-rose-500"
                    : "text-emerald-600"
                }
              >
                {formatAmount(
                  filtered
                    .filter((t) => selectedIds.includes(t.id))
                    .reduce((s, t) => s + (t.amount || 0), 0),
                  currency
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

RecentTransactions.displayName = "RecentTransactions";