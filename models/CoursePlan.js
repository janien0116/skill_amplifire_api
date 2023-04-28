const mongoose = require("mongoose");

const coursePlanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  curriculum: {
    type: String,
    required: true,
  },
  courseSet: [
    {
      category: {
        type: String,
        required: true,
      },
      courses: {
        type: [String],
        required: true,
      }
    },
  ],
  amountPaid: {
    type: Number,
    required: true,
  },
  dateEnrolled: {
    type: String,
    required: true,
    maxlength: 10
  },
});

module.exports = mongoose.model("CoursePlan", coursePlanSchema);
