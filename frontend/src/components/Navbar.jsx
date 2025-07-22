import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
      <Link to="/" className="font-bold text-xl">DP-Elearning</Link>
      <div>
        {user && <Link to="/dashboard" className="mr-4 hover:underline">Dashboard</Link>}
        {user
          ? <button onClick={logout} className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded transition">Logout</button>
          : <Link to="/login" className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition">Login</Link>
        }
      </div>
    </nav>
  );
} 