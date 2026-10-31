import { useState } from "react";
import { CATEGORIES } from "../utils/categories";
import { todayISO } from "../utils/format";

const empty = () => ({ type: "EXPENSE", category: "Food", amount: "", note: "", date: todayISO() });

// onAdd must return a promise that rejects on failure.
export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(empty());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setType = (type) => setForm({ ...form, type, category: CATEGORIES[type][0] });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    const amount = Number(form.amount);
    if (!form.amount || !(amount >= 0.01)) e.amount = "Enter an amount of at least 0.01";
    if (!form.date) e.date = "Pick a date";
    if (form.note.length > 200) e.note = "Max 200 characters";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await onAdd({ ...form, amount: Number(form.amount) });
      setForm({ ...empty(), type: form.type, category: form.category }); // keep type/category for fast entry
    } catch {
      /* the parent already showed a toast */
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const tab = (t) =>
    `flex-1 py-2 text-sm font-medium rounded-lg ${
      form.type === t
        ? t === "INCOME" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        : "bg-slate-100 text-slate-600"
    }`;

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 space-y-3" noValidate>
      <h2 className="font-semibold">Add transaction</h2>

      <div className="flex gap-2">
        <button type="button" className={tab("EXPENSE")} onClick={() => setType("EXPENSE")}>Expense</button>
        <button type="button" className={tab("INCOME")} onClick={() => setType("INCOME")}>Income</button>
      </div>

      <label className="block text-xs text-slate-500">Category
        <select name="category" value={form.category} onChange={handleChange} className={field}>
          {CATEGORIES[form.type].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="block text-xs text-slate-500">Amount (₹)
        <input name="amount" type="number" inputMode="decimal" step="0.01" min="0.01" placeholder="0.00"
          value={form.amount} onChange={handleChange} className={field} />
        {errors.amount && <span className="text-red-600">{errors.amount}</span>}
      </label>

      <label className="block text-xs text-slate-500">Date
        <input name="date" type="date" value={form.date} onChange={handleChange} className={field} />
        {errors.date && <span className="text-red-600">{errors.date}</span>}
      </label>

      <label className="block text-xs text-slate-500">Note (optional)
        <input name="note" maxLength={200} placeholder="e.g. Lunch with team" value={form.note}
          onChange={handleChange} className={field} />
        {errors.note && <span className="text-red-600">{errors.note}</span>}
      </label>

      <button type="submit" disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 disabled:opacity-50">
        {saving ? "Saving..." : "Add"}
      </button>
    </form>
  );
}
