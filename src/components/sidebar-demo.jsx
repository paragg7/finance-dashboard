"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBell,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Sidebar Components
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";

// Dashboard Components
import IncomeExpenseChartCard from "./ui/IncomeExpenseChart";
import RecentTransactions from "./ui/Transactions";
import SpendingBreakdownList from "./ui/pieChart";
import SummaryCard from "./ui/SummaryCard";

// Data
import { dashboardCards } from "@/data/dashboardCards";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 70;

// ─── Navigation Links with unique IDs ─────────────────────────────────────────
const NAVIGATION_LINKS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "#dashboard",
    icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "profile",
    label: "Profile",
    href: "#profile",
    icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "#settings",
    icon: <IconSettings className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "logout",
    label: "Logout",
    href: "#logout",
    icon: <IconArrowLeft className="h-5 w-5 flex-shrink-0" />,
  },
];

// ─── Logo Component ───────────────────────────────────────────────────────────
const Logo = React.memo(function Logo({ isCollapsed }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2.5 rounded-lg px-1 py-2 transition-colors hover:bg-neutral-100"
      aria-label="Acet Labs - Go to homepage"
    >
      {/* Logo Icon */}
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-neutral-900 to-neutral-700">
        <span className="text-xs font-bold text-white">S</span>
      </div>

      {/* Logo Text - Animated */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            key="logo-text"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden whitespace-nowrap text-sm font-semibold text-neutral-900"
          >
            snax club
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
});

// ─── User Profile Component ───────────────────────────────────────────────────
const UserProfile = React.memo(function UserProfile({ isCollapsed }) {
  const user = {
    name: "Snax",
    email: "snax@snaxmax.com",
    avatar: "https://assets.aceternity.com/manu.png",
  };

  return (
    <a
      href="#profile"
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 transition-colors",
        "hover:bg-neutral-100",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
      )}
      aria-label={`User profile: ${user.name}`}
    >
      <img
        src={user.avatar}
        alt=""
        className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-neutral-200"
        width={32}
        height={32}
      />

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            key="user-info"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-w-0 overflow-hidden"
          >
            <p className="truncate text-sm font-medium text-neutral-800">
              {user.name}
            </p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
});

// ─── Dashboard Header ─────────────────────────────────────────────────────────
const DashboardHeader = React.memo(function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200  backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Page Title - Mobile */}
        <h1 className="text-lg font-semibold text-neutral-900 md:hidden">
          Dashboard
        </h1>

        {/* Search Bar - Desktop */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <IconSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search transactions, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50",
              "pl-10 pr-4 text-sm text-neutral-700 placeholder-neutral-400",
              "transition-colors focus:border-neutral-300 focus:bg-white",
              "focus:outline-none focus:ring-2 focus:ring-neutral-200"
            )}
            aria-label="Search"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Search - Mobile */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 md:hidden"
            aria-label="Search"
          >
            <IconSearch size={20} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label="View notifications"
          >
            <IconBell size={20} />
            {/* Notification badge */}
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label="Toggle dark mode"
          >
            <IconSun size={20} />
          </button>
        </div>
      </div>
    </header>
  );
});

// ─── Dashboard Content ────────────────────────────────────────────────────────
const Dashboard = React.memo(function Dashboard() {
  // Generate stable keys for cards
  const cardsWithIds = useMemo(() => {
    return dashboardCards.map((card, index) => ({
      ...card,
      id:
        card.id ||
        `summary-card-${card.title?.replace(/\s+/g, "-").toLowerCase() || index}`,
    }));
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-6">
      {/* Page Title */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Welcome back! Here's an overview of your finances.
        </p>
      </div>

      {/* Summary Cards */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Financial Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardsWithIds.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">
          Financial Charts
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IncomeExpenseChartCard />
          <SpendingBreakdownList />
        </div>
      </section>

      {/* Recent Transactions */}
      <section aria-labelledby="transactions-heading">
        <h2 id="transactions-heading" className="sr-only">
          Recent Transactions
        </h2>
        <RecentTransactions />
      </section>
    </div>
  );
});

// ─── Sidebar Content ──────────────────────────────────────────────────────────
const SidebarContent = React.memo(function SidebarContent({
  isCollapsed,
  activeLink,
  onLinkClick,
}) {
  return (
    <>
      {/* Logo */}
      <div className="mb-6">
        <Logo isCollapsed={isCollapsed} />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {NAVIGATION_LINKS.map((link) => (
          <SidebarLink
            key={link.id}
            link={link}
            isActive={activeLink === link.id}
            onClick={() => onLinkClick(link.id)}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-neutral-200 pt-4">
        <UserProfile isCollapsed={isCollapsed} />
      </div>
    </>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");

  const handleLinkClick = useCallback((linkId) => {
    setActiveLink(linkId);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only",
          "focus:absolute focus:left-4 focus:top-4 focus:z-[100]",
          "focus:rounded-lg focus:bg-white focus:px-4 focus:py-2",
          "focus:text-sm focus:font-medium focus:text-neutral-900",
          "focus:shadow-lg focus:ring-2 focus:ring-neutral-400"
        )}
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-6">
          <SidebarContent
            isCollapsed={!open}
            activeLink={activeLink}
            onLinkClick={handleLinkClick}
          />
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
          aria-label="Dashboard content"
        >
          <DashboardHeader />
          <Dashboard />
        </main>
      </div>
    </div>
  );
}