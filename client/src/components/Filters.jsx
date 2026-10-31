import { ALL_CATEGORIES } from "../utils/categories";

export const DEFAULT_FILTERS = { type: "ALL", category: "ALL", from: "", to: "" };

export default function Filters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const field = "w-full border border-slate-300 rounded-lg p-2 text-sm bg-white";
  const isActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="text-xs text-slate-500">Type
          <select value={filters.type} onChange={set("type")} className={field}>
            <option value="ALL">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>
        <label className="text-xs text-slate-500">Category
          <select value={filters.category} onChange={set("category")} className={field}>
            <option value="ALL">All</option>
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-500">From
          <input type="date" value={filters.from} max={filters.to || undefined} onChange={set("from")} className={field} />
        </label>
        <label className="text-xs text-slate-500">To
          <input type="date" value={filters.to} min={filters.from || undefined} onChange={set("to")} className={field} />
        </label>
      </div>
      {isActive && (
        <button onClick={() => onChange(DEFAULT_FILTERS)} className="mt-3 text-sm text-blue-600 hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );
}
