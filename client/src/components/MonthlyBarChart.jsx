import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatCurrency, formatMonth } from "../utils/format";

export default function MonthlyBarChart({ data }) {
  const rows = data.map((r) => ({ ...r, label: formatMonth(r.month) }));
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="font-semibold mb-2">Monthly trend</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center">No data to chart yet.</p>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} width={48} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
