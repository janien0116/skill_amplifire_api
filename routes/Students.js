const express = require("express");
const router = express.Router();
const studentController = require("../controllers/StudentsController");
const authController = require("../controllers/AuthController");
const fileUpload = require("../middlewares/fileUpload");

router.post("/logout", authController.logoutStudent);
router.post("/:studentId", studentController.enrollCoursePlan);
router.put("/:studentId/project", fileUpload.single("studentOutput"), studentController.submitProject);
router.post("/:studentId/rate", studentController.addCourseRating);
router.post("/:studentId/courses", studentController.addCustomCourse);
router.get("/:studentId/courseplan", studentController.getCoursePlan);
router.get("/:studentId/progress", studentController.getCourseplanProgress);
router.get("/:studentId/courses", studentController.getCustomCourses);
router.put("/:studentId/courses", studentController.addCoursetoCoursePlan);
router.delete("/:studentId/courseplan", studentController.unenrollCourseplan);

module.exports = router;