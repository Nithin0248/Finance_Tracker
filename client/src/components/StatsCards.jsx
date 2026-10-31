import StatCard from "./StatCard";

export default function StatsCards({ totals }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <StatCard label="Total income" value={totals.income} tone="green" />
      <StatCard label="Total expenses" value={totals.expense} tone="red" />
      <StatCard label="Balance" value={totals.balance} tone={totals.balance >= 0 ? "blue" : "red"} />
    </div>
  );
}
