import React from "react"
import SummaryCard from "./components/ui/SummaryCard"
import { dashboardCards } from "./data/dashboardCards"
import IncomeExpenseChart from "@/components/ui/IncomeExpenseChart.jsx"
import PieChartCard from "./components/ui/pieChart"
import RecentTransactions from "./components/ui/Transactions"
import SidebarDemo from "./components/sidebar-demo"

const App = () => {
  return (
    <SidebarDemo>
      <div className="min-h-screen p-6 w-full">
        
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <SummaryCard key={index} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="py-6 flex gap-6">
          <IncomeExpenseChart />
          <PieChartCard />
        </div>

        {/* Transactions */}
        <RecentTransactions />

      </div>
    </SidebarDemo>
  )
}

export default App