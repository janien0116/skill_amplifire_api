const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        default: null,
    }
  });
  
  module.exports = mongoose.model("Student", studentSchema);