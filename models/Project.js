const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  instructorId: {
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
  studentName: {
    type: String,
    required: true,
  },
  studentOutput: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    default: 50,
  },
});

module.exports = mongoose.model("Project", projectSchema);
