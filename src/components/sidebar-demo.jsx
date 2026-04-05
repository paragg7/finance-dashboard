"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// your components
import IncomeExpenseChartCard from "./ui/IncomeExpenseChart";
import RecentTransactions from "./ui/Transactions";
import { dashboardCards } from "@/data/dashboardCards";
import SpendingBreakdownList from "./ui/pieChart";
import SummaryCard from "./ui/SummaryCard";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden  ">
      
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between  gap-10">
          
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* User */}
          <SidebarLink
            link={{
              label: "Snax",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}

// Expanded Logo
const Logo = () => (
  <div className="flex items-center space-x-2 py-2 text-black">
    <div className="h-5 w-6 bg-black rounded" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Acet Labs
    </motion.span>
  </div>
);

// Collapsed Logo
const LogoIcon = () => (
  <div className="h-5 w-6 bg-black rounded mx-auto mt-2" />
);



// ✅ DASHBOARD (FINAL PERFECT LAYOUT)
const Dashboard = () => {
  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full space-y-6">

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Charts + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChartCard />
        <SpendingBreakdownList />
      </div>

      {/* Transactions */}
      <RecentTransactions />

    </div>
  );
};