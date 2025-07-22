import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import api from "../api";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL"),
  instructor: z.string().min(1, "Instructor name is required"),
  price: z.coerce.number().positive("Price must be positive"),
});

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    instructor: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard | add | manage
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Only allow admin access
  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="text-2xl font-bold mb-2">Access Denied</div>
          <div className="text-gray-600">You must be an admin to view this page.</div>
        </div>
      </div>
    );
  }

  // Fetch courses for dashboard/manage
  useEffect(() => {
    if (currentView !== "add") fetchCourses();
    // eslint-disable-next-line
  }, [currentView]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/admin/all-with-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Add Course Logic ---
  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    setMessage("");
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    let parsed;
    try {
      parsed = courseSchema.parse(form);
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(er => {
          fieldErrors[er.path[0]] = er.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/courses",
        parsed,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Course added successfully!");
      setForm({ title: "", description: "", category: "", image: "", instructor: "", price: "" });
      fetchCourses(); // Refresh course list after adding
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  // --- Edit Course Logic ---
  const startEdit = course => {
    setEditId(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      category: course.category,
      image: course.image || "",
      instructor: course.instructor || "",
      price: course.price,
    });
    setEditErrors({});
    setMessage("");
  };
  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setEditErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };
  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditErrors({});
    let parsed;
    try {
      parsed = courseSchema.parse(editForm);
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(er => {
          fieldErrors[er.path[0]] = er.message;
        });
        setEditErrors(fieldErrors);
      }
      return;
    }
    setEditLoading(true);
    try {
      await api.put(
        `/courses/${editId}`,
        parsed,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditForm({});
      fetchCourses();
      setMessage("Course updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to update course");
    } finally {
      setEditLoading(false);
    }
  };
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    try {
      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
      setMessage("Course deleted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  // --- Views ---
  const renderDashboard = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">All Courses</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course._id} className="border-2 border-black rounded shadow p-4 bg-white">
              <h3 className="text-xl font-semibold mb-2 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{course.title}</h3>
              <div className="text-gray-700 mb-1">Students: {course.studentCount}</div>
              <div className="text-gray-600 text-sm">Category: {course.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddCourse = () => (
    <div className="bg-white rounded shadow p-8 w-full max-w-lg border-2 border-black">
      <h2 className="text-2xl font-bold mb-6 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Add New Course</h2>
      {message && <div className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Instructor Name</label>
          <input name="instructor" value={form.instructor} onChange={handleChange} className="w-full border p-2 rounded" />
          {errors.instructor && <div className="text-red-500 text-sm mt-1">{errors.instructor}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Price (INR)</label>
          <input name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" type="number" min="1" />
          {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
        </div>
        <button type="submit" className="bg-blue-700 hover:bg-blue-900 text-white py-2 rounded font-semibold transition" disabled={loading}>
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );

  const renderManageCourses = () => (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Manage Courses</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course._id} className="border rounded shadow p-4 bg-white relative">
              {editId === course._id ? (
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="border p-2 rounded" />
                  {editErrors.title && <div className="text-red-500 text-sm">{editErrors.title}</div>}
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border p-2 rounded" />
                  {editErrors.description && <div className="text-red-500 text-sm">{editErrors.description}</div>}
                  <input name="category" value={editForm.category} onChange={handleEditChange} className="border p-2 rounded" />
                  {editErrors.category && <div className="text-red-500 text-sm">{editErrors.category}</div>}
                  <input name="image" value={editForm.image} onChange={handleEditChange} className="border p-2 rounded" />
                  {editErrors.image && <div className="text-red-500 text-sm">{editErrors.image}</div>}
                  <input name="instructor" value={editForm.instructor} onChange={handleEditChange} className="border p-2 rounded" />
                  {editErrors.instructor && <div className="text-red-500 text-sm">{editErrors.instructor}</div>}
                  <input name="price" value={editForm.price} onChange={handleEditChange} className="border p-2 rounded" type="number" min="1" />
                  {editErrors.price && <div className="text-red-500 text-sm">{editErrors.price}</div>}
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded" disabled={editLoading}>Save</button>
                    <button type="button" className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{course.title}</h3>
                  <div className="text-gray-600 mb-1">Students: {course.studentCount}</div>
                  <div className="text-gray-500 text-sm mb-2">Category: {course.category}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded" onClick={() => startEdit(course)}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={() => handleDelete(course._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col py-8 px-4 shadow-xl">
        <div className="text-3xl font-extrabold mb-10 tracking-tight text-black-700 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Admin Panel</div>
        <nav className="flex-1 flex flex-col gap-4">
          <button
            className={`text-left px-3 py-2 rounded-lg transition font-semibold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
              currentView === "dashboard"
                ? "bg-black text-white shadow-lg"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => setCurrentView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`text-left px-3 py-2 rounded-lg transition font-semibold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
              currentView === "add"
                ? "bg-black text-white shadow-lg"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => setCurrentView("add")}
          >
            Add Course
          </button>
          <button
            className={`text-left px-3 py-2 rounded-lg transition font-semibold text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
              currentView === "manage"
                ? "bg-black text-white shadow-lg"
                : "text-black hover:bg-gray-100"
            }`}
            onClick={() => setCurrentView("manage")}
          >
            Manage Courses
          </button>
        </nav>
        <button className="mt-10 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg font-bold shadow-lg transition drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" onClick={logout}>Logout</button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "add" && renderAddCourse()}
        {currentView === "manage" && renderManageCourses()}
        {message && currentView !== "add" && <div className={`mt-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</div>}
      </main>
    </div>
  );
} 