const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    instructorName: {
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
    accessToken: {
        type: String,
        default: null,
    },
  });
  
  module.exports = mongoose.model("Instructor", instructorSchema);