import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import Filters, { DEFAULT_FILTERS } from "../components/Filters";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import { calcTotals, expenseByCategory, monthlyTrend } from "../utils/stats";

// Newest first; same-day entries keep newest-added on top.
const sortDesc = (list) => [...list].sort((a, b) => b.date.localeCompare(a.date));

const errorMessage = (err, fallback) =>
  err.response ? err.response.data?.error || fallback : "Cannot reach the server";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    api
      .get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => toast.error(errorMessage(err, "Could not load transactions")))
      .finally(() => setLoading(false));
  }, []);

  // Filtering happens in the browser, so charts and cards update instantly.
  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (filters.type === "ALL" || t.type === filters.type) &&
          (filters.category === "ALL" || t.category === filters.category) &&
          (!filters.from || t.date >= filters.from) &&
          (!filters.to || t.date <= filters.to)
      ),
    [transactions, filters]
  );

  const totals = useMemo(() => calcTotals(filtered), [filtered]);
  const pieData = useMemo(() => expenseByCategory(filtered), [filtered]);
  const barData = useMemo(() => monthlyTrend(filtered), [filtered]);

  const addTransaction = async (payload) => {
    try {
      const { data } = await api.post("/transactions", payload);
      setTransactions((prev) => sortDesc([data, ...prev])); // charts update immediately
      toast.success("Transaction added");
    } catch (err) {
      toast.error(errorMessage(err, "Could not add transaction"));
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    const snapshot = transactions;
    setTransactions((prev) => prev.filter((t) => t.id !== id)); // optimistic update
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
    } catch (err) {
      setTransactions(snapshot); // roll back if the server refused
      toast.error(errorMessage(err, "Could not delete transaction"));
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get("/transactions/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(errorMessage(err, "Export failed"));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hello, {user?.name} 👋</h1>
          <p className="text-sm text-slate-500">Here is your money at a glance.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20" role="status" aria-label="Loading">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <StatsCards totals={totals} />
            <Filters filters={filters} onChange={setFilters} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <CategoryPieChart data={pieData} />
                  <MonthlyBarChart data={barData} />
                </div>
                <TransactionList transactions={filtered} onDelete={deleteTransaction} onExport={exportCsv} />
              </div>
              <div className="lg:order-last order-first">
                <TransactionForm onAdd={addTransaction} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
