const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Public: list courses
router.get('/', courseController.getCourses);

// Purchased courses (must be before /:id)
router.get('/purchased', authMiddleware, courseController.getPurchasedCourses);

// Protected: get course details (only if purchased)
router.get('/:id', authMiddleware, courseController.getCourseById);

// Admin only: create, update, delete
router.post('/', authMiddleware, requireRole('admin'), courseController.createCourse);
router.put('/:id', authMiddleware, requireRole('admin'), courseController.updateCourse);
router.delete('/:id', authMiddleware, requireRole('admin'), courseController.deleteCourse);

// Admin only: get all courses with student count
router.get('/admin/all-with-students', authMiddleware, requireRole('admin'), courseController.getCoursesWithStudentCount);

// Purchase course
router.post('/purchase', authMiddleware, courseController.purchaseCourse);

module.exports = router; 