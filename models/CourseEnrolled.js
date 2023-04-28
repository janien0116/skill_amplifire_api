const mongoose = require("mongoose");

const courseEnrolledSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  dateEnrolled: {
    type: String,
    required: true,
    maxlength: 10,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("CourseEnrolled", courseEnrolledSchema);
