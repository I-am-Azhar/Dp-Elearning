const { z } = require('zod');
const User = require('../models/User');
const Course = require('../models/Course');
const { getSignedVideoUrl } = require('../utils/cloudinary');

const videoSchema = z.object({
  courseId: z.string().min(1),
  videoIndex: z.number().int().min(0),
});

async function getVideoUrl(req, res) {
  try {
    const { courseId, videoIndex } = videoSchema.parse(req.body);
    const user = req.user;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!user.purchasedCourses.includes(courseId) && user.role !== 'admin') {
      return res.status(403).json({ error: 'You have not purchased this course' });
    }
    if (!course.videoLinks[videoIndex]) {
      return res.status(404).json({ error: 'Video not found' });
    }
    // Assume videoLinks[] contains Cloudinary public IDs
    const signedUrl = getSignedVideoUrl(course.videoLinks[videoIndex], 3600); // 1 hour expiry
    res.json({ url: signedUrl });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
}

module.exports = { getVideoUrl }; 