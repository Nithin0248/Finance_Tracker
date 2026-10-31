import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "../utils/categories";
import { formatCurrency } from "../utils/format";

export default function CategoryPieChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="font-semibold mb-2">Expenses by category</h2>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500 py-12 text-center">No expenses to chart yet.</p>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="75%" paddingAngle={2}>
                {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
