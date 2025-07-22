const Course = require('../models/Course');
const User = require('../models/User');
const { z } = require('zod');

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  videoLinks: z.array(z.string().url()).optional(),
  thumbnail: z.string().url().optional(),
});

async function createCourse(req, res) {
  try {
    const parsed = courseSchema.parse(req.body);
    const course = await Course.create(parsed);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
}

async function getCourses(req, res) {
  const courses = await Course.find();
  res.json(courses);
}

async function getCourseById(req, res) {
  const courseId = req.params.id;
  const user = req.user;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  let courseData = course.toObject();
  if (!user.purchasedCourses.map(id => id.toString()).includes(courseId) && user.role !== 'admin') {
    // Hide videoLinks if not purchased
    courseData.videoLinks = [];
  }
  res.json(courseData);
}

async function updateCourse(req, res) {
  try {
    const parsed = courseSchema.partial().parse(req.body);
    const course = await Course.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
}

async function deleteCourse(req, res) {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ message: 'Course deleted' });
}

async function purchaseCourse(req, res) {
  const userId = req.user.id;
  const { courseId } = req.body;

  // Validate courseId
  if (!courseId) return res.status(400).json({ error: 'Course ID is required' });

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Add course to user's purchasedCourses if not already present
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.purchasedCourses.includes(courseId)) {
    user.purchasedCourses.push(courseId);
    await user.save();
  }

  res.json({ message: 'Course purchased successfully' });
}

async function getPurchasedCourses(req, res) {
  const user = await User.findById(req.user.id).populate('purchasedCourses');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ courses: user.purchasedCourses });
}

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  purchaseCourse,
  getPurchasedCourses,
}; 