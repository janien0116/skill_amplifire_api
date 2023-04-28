const mongoose = require("mongoose");

const instructorClassSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("InctructorClass", instructorClassSchema);
