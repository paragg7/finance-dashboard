// src/data/dashboardCards.jsx

export const dashboardCards = [
  {
    title: "Balance",
    amount: 34200,
    change: 4.3,
    icon: "wallet",
    segments: [
      { label: "Cash", value: 60, bg: "bg-teal-500" },
      { label: "Wallet", value: 40, bg: "bg-blue-500" },
    ],
    footer: "Net: +$4,567 this month",
  },
  {
    title: "Income",
    amount: 134840,
    change: 78,
    icon: "income",
    segments: [
      { label: "Investments", value: 30, bg: "bg-teal-500" },
      { label: "Freelance", value: 40, bg: "bg-blue-500" },
      { label: "Salary", value: 30, bg: "bg-yellow-400" },
    ],
    footer: "Upcoming Income: February 28th",
  },
  {
    title: "Expense",
    amount: 34359,
    change: -3.2,
    icon: "expense",
    segments: [
      { label: "Transport", value: 30, bg: "bg-teal-500" },
      { label: "Eat", value: 40, bg: "bg-blue-500" },
      { label: "Subscriptions", value: 10, bg: "bg-yellow-400" },
      { label: "Entertainment", value: 20, bg: "bg-red-400" },
    ],
    footer: "60% of the monthly budget",
  },
];

export const incomeExpenseChartData = [
  ["Month", "Income", { role: "style" }, "Expense", { role: "style" }],
  ["Jan", 28000, "#CFEFED", 36000, "#EDF2F5"],
  ["Feb", 42000, "#CFEFED", 61000, "#EDF2F5"],
  ["Mar", 36000, "#CFEFED", 28000, "#EDF2F5"],
  ["Apr", 48000, "#CFEFED", 54000, "#EDF2F5"],
  ["May", 68000, "#CFEFED", 68000, "#EDF2F5"],
  ["Jun", 80435, "#22B3A6", 12840, "#0F2F2E"],
  ["Jul", 52000, "#CFEFED", 64000, "#EDF2F5"],
  ["Aug", 47000, "#CFEFED", 52000, "#EDF2F5"],
  ["Sep", 76000, "#CFEFED", 50000, "#EDF2F5"],
  ["Oct", 49000, "#CFEFED", 36000, "#EDF2F5"],
  ["Nov", 31000, "#CFEFED", 21000, "#EDF2F5"],
  ["Dec", 36000, "#CFEFED", 28000, "#EDF2F5"],
];