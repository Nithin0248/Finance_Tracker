// Pure functions: given a list of transactions, compute what the dashboard shows.

export const calcTotals = (list) => {
  let income = 0;
  let expense = 0;
  for (const t of list) {
    if (t.type === "INCOME") income += Number(t.amount);
    else expense += Number(t.amount);
  }
  return { income, expense, balance: income - expense };
};

// [{ name: "Food", value: 1200 }, ...] for the pie chart (expenses only)
export const expenseByCategory = (list) => {
  const map = new Map();
  for (const t of list) {
    if (t.type !== "EXPENSE") continue;
    map.set(t.category, (map.get(t.category) || 0) + Number(t.amount));
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// [{ month: "2026-10", income, expense }, ...] sorted oldest -> newest, last `limit` months
export const monthlyTrend = (list, limit = 6) => {
  const map = new Map();
  for (const t of list) {
    const key = t.date.slice(0, 7);
    const row = map.get(key) || { month: key, income: 0, expense: 0 };
    if (t.type === "INCOME") row.income += Number(t.amount);
    else row.expense += Number(t.amount);
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-limit);
};
