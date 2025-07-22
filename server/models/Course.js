const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  videoLinks: [{ type: String }],
  thumbnail: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema); 