import React from 'react'
import SummaryCard from './components/ui/SummaryCard'
import { incomeExpenseChartData } from "./data/dashboardCards";
import { dashboardCards } from "./data/dashboardCards";
import IncomeExpenseChart from './components/ui/IncomeExpenseChart';
const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
          
        ))}
      </div>
       <div className="py-6">
      <IncomeExpenseChart />
    </div>
    

    </div>
  )
}

export default App