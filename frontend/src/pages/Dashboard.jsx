import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses/purchased")
      .then(res => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Your Purchased Courses</h2>
      {courses.length === 0 ? (
        <div>No courses purchased yet.</div>
      ) : (
        <ul className="grid gap-4">
          {courses.map(course => (
            <li key={course.id} className="border rounded p-4 shadow bg-white">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600">₹{course.price}/-</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 