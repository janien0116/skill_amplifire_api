const mongoose = require("mongoose");

const customCourseSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  curriculum: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("CustomCourse", customCourseSchema);
