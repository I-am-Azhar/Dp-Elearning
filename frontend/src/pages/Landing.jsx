import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data));
  }, []);

  const handleBuy = (courseId) => {
    if (!user) {
      navigate("/login", { state: { from: "/", courseId } });
    } else {
      navigate(`/buy/${courseId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to DP-Elearning Platform</h1>
      <div className="grid gap-6">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
} 