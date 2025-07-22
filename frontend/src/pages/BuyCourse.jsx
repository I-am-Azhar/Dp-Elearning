import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function BuyCourse() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(() => setCourse(null));
  }, [courseId]);

  const handlePurchase = async () => {
    setError("");
    try {
      await api.post("/courses/purchase", { courseId });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Purchase failed");
    }
  };

  if (!course) return <div>Course not found.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Buy {course.title}</h2>
      <p className="mb-4">Price: ₹{course.price}/-</p>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
        onClick={handlePurchase}
      >
        Confirm Purchase
      </button>
    </div>
  );
} 