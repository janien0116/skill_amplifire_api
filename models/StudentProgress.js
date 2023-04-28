const mongoose = require("mongoose");

const studentProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  noOfCourses: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("StudentProgress", studentProgressSchema);