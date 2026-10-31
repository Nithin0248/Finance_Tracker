import { formatCurrency } from "../utils/format";

const TONES = {
  green: "text-emerald-600",
  red: "text-red-600",
  blue: "text-blue-600",
  slate: "text-slate-700",
};

// Reusable card: used three times by StatsCards.
export default function StatCard({ label, value, tone = "slate" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-xl sm:text-2xl font-bold break-words ${TONES[tone]}`}>{formatCurrency(value)}</p>
    </div>
  );
}
