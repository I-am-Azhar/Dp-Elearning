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
    <div className="min-h-screen bg-[#FFDDD2] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">
          Explore Courses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} onBuy={handleBuy} />
          ))}
        </div>
      </div>
    </div>
  );
} 