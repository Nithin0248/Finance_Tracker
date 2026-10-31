export const CATEGORIES = {
  EXPENSE: ["Food", "Rent", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"],
  INCOME: ["Salary", "Freelance", "Investments", "Gift", "Other"],
};

export const ALL_CATEGORIES = [...new Set([...CATEGORIES.EXPENSE, ...CATEGORIES.INCOME])];

// Colour-blind friendly palette for charts
export const CHART_COLORS = [
  "#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
  "#14b8a6", "#ec4899", "#64748b", "#84cc16",
];
