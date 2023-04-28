const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  videoThumbnail: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  curriculum: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  outputDescription: {
    type: String,
    required: true
  },
  outputLink: {
    type: [String],
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
