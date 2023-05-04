const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const studentsController = require("../controllers/StudentsController");

router.post("/student-login", authController.loginStudent);
router.post("/signup", studentsController.studentSignUp);
router.post("/instructor-login", authController.loginInstructor);
router.get("/", studentsController.getCourses);

module.exports = router;