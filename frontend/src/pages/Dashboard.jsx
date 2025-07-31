import { useEffect, useState } from "react";
import api from "../api";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get("/courses/purchased")
      .then(res => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleViewCourse = (courseId) => {
    // Navigate to course details or video player
    navigate(`/course/${courseId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFDDD2] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mt-10 text-lg">Loading your profile...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFDDD2] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">
          My Profile
        </h2>
        
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {user?.name || 'User'}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Purchased:</span>
                <span className="font-medium">{courses.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Courses Section */}
        <h3 className="text-2xl font-bold mb-6 text-center text-black">
          My Purchased Courses
        </h3>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <div className="text-gray-500 text-lg mb-4">
                No courses purchased yet.
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Start your learning journey by purchasing a course from our catalog.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                onBuy={handleViewCourse}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 