import { useState } from "react";
import { formatCurrency, formatDate } from "../utils/format";

const PAGE = 10;

export default function TransactionList({ transactions, onDelete, onExport }) {
  const [visible, setVisible] = useState(PAGE);
  const shown = transactions.slice(0, visible);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Transactions <span className="text-slate-400 font-normal">({transactions.length})</span></h2>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline">Export CSV</button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">No transactions to show. Add one to get started.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {shown.map((t) => (
            <li key={t.id} className="py-3 flex items-center gap-3">
              <span className={`shrink-0 w-2 h-8 rounded ${t.type === "INCOME" ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{t.category}</p>
                <p className="text-xs text-slate-500 truncate">{formatDate(t.date)}{t.note ? ` · ${t.note}` : ""}</p>
              </div>
              <p className={`font-semibold whitespace-nowrap ${t.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
              <button onClick={() => onDelete(t.id)} aria-label={`Delete ${t.category} transaction`}
                className="text-slate-400 hover:text-red-600 text-lg leading-none px-1">×</button>
            </li>
          ))}
        </ul>
      )}

      {visible < transactions.length && (
        <button onClick={() => setVisible(visible + PAGE)}
          className="mt-3 w-full text-sm text-blue-600 hover:underline">Show more</button>
      )}
    </div>
  );
}
