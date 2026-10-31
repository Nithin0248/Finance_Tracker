import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-blue-600">💰 FinTrack</span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-slate-500">{user?.name}</span>
          <button onClick={handleLogout} className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded-lg">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
