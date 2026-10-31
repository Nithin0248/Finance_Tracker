import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// One reusable form for both Login and Register.
export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      toast.success(isRegister ? "Account created!" : "Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response
          ? err.response.data?.error || `Request failed (${err.response.status})`
          : "Cannot reach the server. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="text-center text-sm text-slate-500">Personal Finance Tracker</p>

        {error && <p role="alert" className="text-red-600 text-sm bg-red-50 rounded p-2">{error}</p>}

        {isRegister && (
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
            required className={input} autoComplete="name" />
        )}
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          required className={input} autoComplete="email" />
        <input type="password" name="password" placeholder={isRegister ? "Password (min 6 characters)" : "Password"}
          value={form.password} onChange={handleChange} required minLength={isRegister ? 6 : undefined}
          className={input} autoComplete={isRegister ? "new-password" : "current-password"} />

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 disabled:opacity-50">
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        <p className="text-sm text-center">
          {isRegister ? "Already have an account? " : "No account? "}
          <Link to={isRegister ? "/login" : "/register"} className="text-blue-600 font-medium">
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}
