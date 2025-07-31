import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BuyCourse from "./pages/BuyCourse";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const showHero = location.pathname !== "/dashboard" && location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      <Navbar />
      {showHero && <Herosection />}
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy/:courseId" element={<BuyCourse />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
