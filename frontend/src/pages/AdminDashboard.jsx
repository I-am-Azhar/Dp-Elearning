import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import api from "../api";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Live", "Coming Soon"], { required_error: "Type is required" }),
  language: z.string().min(1, "Language is required"),
  originalPrice: z.coerce.number().positive("Original price must be positive"),
  discountedPrice: z.coerce.number().positive("Discounted price must be positive"),
  discount: z.string().optional(),
  badge: z.string().optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  price: z.coerce.number().positive("Price must be positive"), // Keep for backward compatibility
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
});

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    type: "",
    language: "",
    originalPrice: "",
    discountedPrice: "",
    discount: "",
    badge: "",
    features: [""],
    price: "",
    thumbnail: "",
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

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm(f => ({ ...f, features: newFeatures }));
    setErrors(prev => ({ ...prev, features: undefined }));
  };

  const addFeature = () => {
    setForm(f => ({ ...f, features: [...f.features, ""] }));
  };

  const removeFeature = (index) => {
    const newFeatures = form.features.filter((_, i) => i !== index);
    setForm(f => ({ ...f, features: newFeatures }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    
    // Filter out empty features
    const filteredFeatures = form.features.filter(feature => feature.trim() !== "");
    
    const formData = {
      ...form,
      features: filteredFeatures,
      price: form.discountedPrice // Set price to discounted price for backward compatibility
    };

    console.log("Submitting form data:", formData);
    console.log("Token:", token);

    let parsed;
    try {
      parsed = courseSchema.parse(formData);
      console.log("Parsed data:", parsed);
    } catch (err) {
      console.error("Validation error:", err);
      console.error("Error message:", err.message);
      console.error("Error issues:", err.issues);
      console.error("Form data that failed:", formData);
      
      if (err.issues) {
        const fieldErrors = {};
        err.issues.forEach(issue => {
          fieldErrors[issue.path[0]] = issue.message;
          console.error(`Field error: ${issue.path[0]} - ${issue.message}`);
        });
        setErrors(fieldErrors);
      } else if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(er => {
          fieldErrors[er.path[0]] = er.message;
          console.error(`Field error: ${er.path[0]} - ${er.message}`);
        });
        setErrors(fieldErrors);
      }
      return;
    }
    setLoading(true);
    try {
      console.log("Making API request to /courses");
      const response = await api.post(
        "/courses",
        parsed,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API response:", response.data);
      setMessage("Course added successfully!");
      setForm({ 
        title: "", 
        subtitle: "", 
        description: "", 
        type: "", 
        language: "", 
        originalPrice: "", 
        discountedPrice: "", 
        discount: "", 
        badge: "", 
        features: [""], 
        price: "", 
        thumbnail: "" 
      });
      fetchCourses(); // Refresh course list after adding
    } catch (err) {
      console.error("API error:", err);
      console.error("Error response:", err.response?.data);
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
      subtitle: course.subtitle || "",
      description: course.description,
      type: course.type || "",
      language: course.language || "",
      originalPrice: course.originalPrice || course.price,
      discountedPrice: course.discountedPrice || course.price,
      discount: course.discount || "",
      badge: course.badge || "",
      features: course.features || [""],
      price: course.price,
      thumbnail: course.thumbnail || "",
    });
    setEditErrors({});
    setMessage("");
  };

  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setEditErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleEditFeatureChange = (index, value) => {
    const newFeatures = [...editForm.features];
    newFeatures[index] = value;
    setEditForm(f => ({ ...f, features: newFeatures }));
    setEditErrors(prev => ({ ...prev, features: undefined }));
  };

  const addEditFeature = () => {
    setEditForm(f => ({ ...f, features: [...f.features, ""] }));
  };

  const removeEditFeature = (index) => {
    const newFeatures = editForm.features.filter((_, i) => i !== index);
    setEditForm(f => ({ ...f, features: newFeatures }));
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditErrors({});
    
    // Filter out empty features
    const filteredFeatures = editForm.features.filter(feature => feature.trim() !== "");
    
    const formData = {
      ...editForm,
      features: filteredFeatures,
      price: editForm.discountedPrice // Set price to discounted price for backward compatibility
    };

    let parsed;
    try {
      parsed = courseSchema.parse(formData);
    } catch (err) {
      if (err.issues) {
        const fieldErrors = {};
        err.issues.forEach(issue => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setEditErrors(fieldErrors);
      } else if (err.errors) {
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
              <div className="text-gray-600 text-sm">Price: ₹{course.discountedPrice || course.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddCourse = () => (
    <div className="bg-white rounded shadow p-8 w-full max-w-2xl border-2 border-black">
      <h2 className="text-2xl font-bold mb-6 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Add New Course</h2>
      {message && <div className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Subtitle *</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full border p-2 rounded" />
            {errors.subtitle && <div className="text-red-500 text-sm mt-1">{errors.subtitle}</div>}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" rows="3" />
          {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Type *</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">Select Type</option>
              <option value="Live">Live</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
            {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Language *</label>
            <input name="language" value={form.language} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Hinglish, English" />
            {errors.language && <div className="text-red-500 text-sm mt-1">{errors.language}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Original Price (₹) *</label>
            <input name="originalPrice" value={form.originalPrice} onChange={handleChange} className="w-full border p-2 rounded" type="number" min="1" />
            {errors.originalPrice && <div className="text-red-500 text-sm mt-1">{errors.originalPrice}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Discounted Price (₹) *</label>
            <input name="discountedPrice" value={form.discountedPrice} onChange={handleChange} className="w-full border p-2 rounded" type="number" min="1" />
            {errors.discountedPrice && <div className="text-red-500 text-sm mt-1">{errors.discountedPrice}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount</label>
            <input name="discount" value={form.discount} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 55% OFF" />
            {errors.discount && <div className="text-red-500 text-sm mt-1">{errors.discount}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Badge</label>
            <input name="badge" value={form.badge} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Black Friday Sale" />
            {errors.badge && <div className="text-red-500 text-sm mt-1">{errors.badge}</div>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Thumbnail URL</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://..." />
            {errors.thumbnail && <div className="text-red-500 text-sm mt-1">{errors.thumbnail}</div>}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Features *</label>
          <div className="space-y-2">
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder={`Feature ${index + 1}`}
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              Add Feature
            </button>
          </div>
          {errors.features && <div className="text-red-500 text-sm mt-1">{errors.features}</div>}
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
                  <input name="title" value={editForm.title} onChange={handleEditChange} className="border p-2 rounded" placeholder="Title" />
                  {editErrors.title && <div className="text-red-500 text-sm">{editErrors.title}</div>}
                  <input name="subtitle" value={editForm.subtitle} onChange={handleEditChange} className="border p-2 rounded" placeholder="Subtitle" />
                  {editErrors.subtitle && <div className="text-red-500 text-sm">{editErrors.subtitle}</div>}
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="border p-2 rounded" placeholder="Description" />
                  {editErrors.description && <div className="text-red-500 text-sm">{editErrors.description}</div>}
                  <select name="type" value={editForm.type} onChange={handleEditChange} className="border p-2 rounded">
                    <option value="">Select Type</option>
                    <option value="Live">Live</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                  {editErrors.type && <div className="text-red-500 text-sm">{editErrors.type}</div>}
                  <input name="language" value={editForm.language} onChange={handleEditChange} className="border p-2 rounded" placeholder="Language" />
                  {editErrors.language && <div className="text-red-500 text-sm">{editErrors.language}</div>}
                  <input name="originalPrice" value={editForm.originalPrice} onChange={handleEditChange} className="border p-2 rounded" type="number" placeholder="Original Price" />
                  {editErrors.originalPrice && <div className="text-red-500 text-sm">{editErrors.originalPrice}</div>}
                  <input name="discountedPrice" value={editForm.discountedPrice} onChange={handleEditChange} className="border p-2 rounded" type="number" placeholder="Discounted Price" />
                  {editErrors.discountedPrice && <div className="text-red-500 text-sm">{editErrors.discountedPrice}</div>}
                  <input name="discount" value={editForm.discount} onChange={handleEditChange} className="border p-2 rounded" placeholder="Discount" />
                  {editErrors.discount && <div className="text-red-500 text-sm">{editErrors.discount}</div>}
                  <input name="badge" value={editForm.badge} onChange={handleEditChange} className="border p-2 rounded" placeholder="Badge" />
                  {editErrors.badge && <div className="text-red-500 text-sm">{editErrors.badge}</div>}
                  <input name="thumbnail" value={editForm.thumbnail} onChange={handleEditChange} className="border p-2 rounded" placeholder="Thumbnail URL" />
                  {editErrors.thumbnail && <div className="text-red-500 text-sm">{editErrors.thumbnail}</div>}
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded" disabled={editLoading}>Save</button>
                    <button type="button" className="bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2 text-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{course.title}</h3>
                  <div className="text-gray-600 mb-1">Students: {course.studentCount}</div>
                  <div className="text-gray-500 text-sm mb-2">Price: ₹{course.discountedPrice || course.price}</div>
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