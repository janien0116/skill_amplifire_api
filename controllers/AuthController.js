const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");

const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).send({msg: "Invalid Credentials"});
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ _id: student._id }, process.env.AUTH_SECRET_TOKEN);
    student.accessToken = accessToken;
    await student.save();
    res.status(200).json({
      msg: "Welcome back to Skill Amplifire!",
      access_token: accessToken,
      _id: student._id,
    });
  } catch (error) {
    res.status(500).json({ msg: "Invalid Credentials", error: error.message });
  }
};

const logoutStudent = async (req, res) => {
  const { _id } = req.body.data;
  try {
    const student = await Student.findById(_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.accessToken = null;
    await student.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginInstructor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const instructor = await Instructor.findOne({ email });

    if (!instructor) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    if (password != instructor.password) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ _id: instructor._id }, process.env.AUTH_SECRET_TOKEN);
    instructor.accessToken = accessToken;
    await instructor.save();
    res.status(200).json({
      message: "Welcome back to Skill Amplifire!",
      access_token: accessToken,
      _id: instructor._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid Credentials" });
  }
};

const logoutInstructor = async (req, res) => {
  const { _id } = req.body.data;
  try {
    const instructor = await Instructor.findById(_id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    instructor.accessToken = null;
    await instructor.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginStudent,
  logoutStudent,
  loginInstructor,
  logoutInstructor,
};
