import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo1 from "../assets/logo1.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMyCourses = location.pathname === "/dashboard";
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white shadow-md w-full">
      <div className="flex items-center gap-2">
        {/* Logo image */}
        <img src={logo1} alt="DP Logo" className="h-10 w-10 object-contain mr-2 " />
        <span className="font-bold text-xl select-none">
          Digital
          <span className="text-blue-500 drop-shadow-[0_0_6px_#3B82F6]">Pa</span>-
          <span className="">E</span>
          <span className="text-blue-500 drop-shadow-[0_0_6px_#3B82F6]">Learning</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`font-medium text-blue-500 underline-offset-4 transition hover:underline focus:underline active:underline ${isMyCourses ? 'underline' : ''}`}
            >
              My Courses
            </Link>
            <button
              onClick={logout}
              className="ml-2 bg-red-500 hover:bg-red-700 px-4 py-1 rounded transition shadow-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-1 rounded shadow-lg font-medium transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none drop-shadow-[0_0_6px_#3B82F6]"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
} 