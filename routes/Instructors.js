const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/InstructorController");
const authController = require("../controllers/AuthController");
const fileUpload = require("../middlewares/fileUpload");

router.post("/logout", authController.logoutInstructor);
router.post(
  "/:instructorId",
  fileUpload.single("videoThumbnail"),
  instructorController.addCourse
);
router.get("/:instructorId", instructorController.getInstructor);
router.get(
  "/:instructorId/courses",
  instructorController.getCoursesByInstructor
);
router.get(
  "/:instructorId/students",
  instructorController.getStudentsByInstructor
);
router.get("/:instructorId/outputs", instructorController.getStudentOutputs);
router.get("/:instructorId/enrolled", instructorController.getEnrolledStudents);
router.get("/:instructorId/revenue", instructorController.getRevenue);
router.get("/:instructorId/ratings", instructorController.getRatings);
router.delete("/:instructorId/course", instructorController.deleteCourse);

module.exports = router;
