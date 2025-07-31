const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  type: { type: String },
  language: { type: String },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: String },
  badge: { type: String },
  features: [{ type: String }],
  price: { type: Number, required: true }, // Keep for backward compatibility
  videoLinks: [{ type: String }],
  thumbnail: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema); 