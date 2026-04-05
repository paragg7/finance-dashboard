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
  {
    month: "Jan",
    income: 3000,
    expense: 2000,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(3000 / 31 + (Math.random() - 0.5) * 40),
      expense: Math.round(2000 / 31 + (Math.random() - 0.5) * 30),
    })),
  },
  {
    month: "Feb",
    income: 4000,
    expense: 2500,
    days: Array.from({ length: 28 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(4000 / 28 + (Math.random() - 0.5) * 50),
      expense: Math.round(2500 / 28 + (Math.random() - 0.5) * 40),
    })),
  },
  {
    month: "Mar",
    income: 3500,
    expense: 2200,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(3500 / 31 + (Math.random() - 0.5) * 45),
      expense: Math.round(2200 / 31 + (Math.random() - 0.5) * 35),
    })),
  },
  {
    month: "Apr",
    income: 2800,
    expense: 2600,
    days: Array.from({ length: 30 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(2800 / 30 + (Math.random() - 0.5) * 40),
      expense: Math.round(2600 / 30 + (Math.random() - 0.5) * 45),
    })),
  },
  {
    month: "May",
    income: 4200,
    expense: 3000,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(4200 / 31 + (Math.random() - 0.5) * 60),
      expense: Math.round(3000 / 31 + (Math.random() - 0.5) * 50),
    })),
  },
  {
    month: "Jun",
    income: 3800,
    expense: 2700,
    days: Array.from({ length: 30 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(3800 / 30 + (Math.random() - 0.5) * 55),
      expense: Math.round(2700 / 30 + (Math.random() - 0.5) * 45),
    })),
  },
  {
    month: "Jul",
    income: 5000,
    expense: 3200,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(5000 / 31 + (Math.random() - 0.5) * 70),
      expense: Math.round(3200 / 31 + (Math.random() - 0.5) * 50),
    })),
  },
  {
    month: "Aug",
    income: 4700,
    expense: 2800,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(4700 / 31 + (Math.random() - 0.5) * 65),
      expense: Math.round(2800 / 31 + (Math.random() - 0.5) * 45),
    })),
  },
  {
    month: "Sep",
    income: 5200,
    expense: 3000,
    days: Array.from({ length: 30 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(5200 / 30 + (Math.random() - 0.5) * 75),
      expense: Math.round(3000 / 30 + (Math.random() - 0.5) * 50),
    })),
  },
  {
    month: "Oct",
    income: 4800,
    expense: 2700,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(4800 / 31 + (Math.random() - 0.5) * 70),
      expense: Math.round(2700 / 31 + (Math.random() - 0.5) * 45),
    })),
  },
  {
    month: "Nov",
    income: 4300,
    expense: 2500,
    days: Array.from({ length: 30 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(4300 / 30 + (Math.random() - 0.5) * 60),
      expense: Math.round(2500 / 30 + (Math.random() - 0.5) * 40),
    })),
  },
  {
    month: "Dec",
    income: 5100,
    expense: 3300,
    days: Array.from({ length: 31 }, (_, i) => ({
      day: String(i + 1),
      income: Math.round(5100 / 31 + (Math.random() - 0.5) * 75),
      expense: Math.round(3300 / 31 + (Math.random() - 0.5) * 55),
    })),
  },
];

export const pieChartData = [
  { month: "january", visitors: 186, fill: "#3B82F6" },
  { month: "february", visitors: 305, fill: "#14B8A6" },
  { month: "march", visitors: 237, fill: "#8B5CF6" },
  { month: "april", visitors: 173, fill: "#F59E0B" },
  { month: "may", visitors: 209, fill: "#EF4444" },
];

export const pieChartMonthLabels = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
};

export const defaultData = {
  monthly: [
    { label: "Food", amount: 4200, color: "bg-teal-500" },
    { label: "Transport", amount: 800, color: "bg-blue-500" },
    { label: "Shopping", amount: 600, color: "bg-yellow-400" },
    { label: "Entertainment", amount: 200, color: "bg-red-400" },
    { label: "Bills", amount: 9000, color: "bg-purple-500" },
  ],
  quarterly: [
    { label: "Food", amount: 28600, color: "bg-teal-500" },
    { label: "Transport", amount: 12400, color: "bg-blue-500" },
    { label: "Shopping", amount: 41800, color: "bg-yellow-400" },
    { label: "Entertainment", amount: 15700, color: "bg-red-400" },
    { label: "Bills", amount: 8200, color: "bg-purple-500" },
  ],
  yearly: [
    { label: "Food", amount: 568000, color: "bg-teal-500" },
    { label: "Transport", amount: 20000, color: "bg-blue-500" },
    { label: "Shopping", amount: 250000, color: "bg-yellow-400" },
    { label: "Entertainment", amount: 50000, color: "bg-red-400" },
    { label: "Bills", amount: 612000, color: "bg-purple-500" },
  ],
};