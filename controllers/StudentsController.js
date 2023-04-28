const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const CoursePlan = require("../models/CoursePlan");
const Project = require("../models/Project");
const mongoose = require("mongoose");
const path = require("path");
const Rating = require("../models/Rating");
const Course = require("../models/Course");
const InstructorClass = require("../models/InstructorClass");
const Instructor = require("../models/Instructor");
const CustomCourse = require("../models/CustomCourse");
const CourseEnrolled = require("../models/CourseEnrolled");
const StudentProgress = require("../models/StudentProgress");

const studentSignUp = async (req, res) => {
  const { fullName, userName, email, password, paymentMethod } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      fullName: fullName,
      userName: userName,
      email: email,
      password: hashPassword,
      paymentMethod: paymentMethod,
    });

    if (student) {
      res.status(201).json({ msg: "Welcome! You're successfully signed up to Skill Amplifire", id: student.id });
    } else {
      res.status(400).json({ msg: "Invalid Fields"});
    }
  } catch (error) {
    res.status(500).json({ msg: "Invalid Fields", error: error.message });
  }
};

const enrollCoursePlan = async (req, res) => {
  console.log(req.params);
  const studentId = req.params.studentId;
  const { curriculum, courseSet, amountPaid } = req.body;

  try {
    const existingCoursePlan = await CoursePlan.findOne({
      studentId: studentId,
    });
    if (existingCoursePlan) {
      return res
        .status(400)
        .json({ msg: "You already have an Enrolled Course Plan. Please unenroll and try again" });
    }

    const courses = [];
    const enrolledCourses = [];
    const dateEnrolled = new Date().toLocaleDateString();

    if (Array.isArray(courseSet)) {
      for (const course of courseSet) {
        courses.push({
          category: course.category,
          courses: course.courses,
        });
        for (const title of course.courses) {
          const courseTitle = await Course.findOne({ title: title });
          const filterStudent = await Student.findById(studentId);

          if (courseTitle) {
            await InstructorClass.create({
              studentId: studentId,
              studentName: filterStudent.fullName,
              instructorId: courseTitle.instructorId,
              courseTitle: courseTitle.title,
            });

            enrolledCourses.push({
              courseTitle: courseTitle.title,
              instructorId: courseTitle.instructorId,
              studentId: studentId,
              dateEnrolled: dateEnrolled,
              amountPaid: courseTitle.amount * 0.8,
            });
          }
        }
      }
    }

    const coursePlan = await CoursePlan.create({
      studentId: studentId,
      curriculum: curriculum,
      courseSet: courses,
      amountPaid: amountPaid,
      dateEnrolled: dateEnrolled,
    });
    if (coursePlan) {
      await CourseEnrolled.insertMany(enrolledCourses);
      await StudentProgress.create({
        studentId: studentId,
        noOfCourses: enrolledCourses.length,
      });
      const customCourses = await CustomCourse.find({ studentId: studentId });
      if (customCourses) {
        await CustomCourse.deleteMany({ studentId: studentId });
      }
      const insertedData = await CoursePlan.findById(coursePlan._id);
      res.status(201).json({ msg: "Congratulations! You're officialy enrolled to Skill Amplifire", data: insertedData});
    } else {
      res.status(400).json({ msg: "Cannot process enrollment this time" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Cannot process enrollment this time", error: error.message });
  }
};

const addCustomCourse = async (req, res) => {
  console.log(req.params);
  const studentId = req.params.studentId;
  const { courseTitle, instructorName, curriculum, category, level, amount } =
    req.body;

  try {
    const customCourse = await CustomCourse.create({
      studentId: studentId,
      courseTitle: courseTitle,
      instructorName: instructorName,
      curriculum: curriculum,
      category: category,
      level: level,
      amount: amount,
    });

    if (customCourse) {
      const insertedData = await CustomCourse.findById(customCourse._id);
      res.status(201).json({
        msg: "Course added to course cart",
        data: insertedData,
      });
    } else {
      res.status(400).json({ msg: "Cannot add to course cart this time" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Cannot add to course cart this time", error: error.message });
  }
};

const submitProject = async (req, res) => {
  const studentId = req.params.studentId;
  const { instructorName, courseId } = req.body;
  const objectIdCourseId = new mongoose.Types.ObjectId(courseId);

  try {
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    let project = await Project.findOne({
      studentId: studentId,
      courseId: objectIdCourseId,
    });

    if (project) {
      project.instructorId = course.instructorId;
      project.courseTitle = course.title;
      project.instructorName = instructorName;
      project.studentName = student.fullName;
      project.studentOutput = req.file.path;

      await project.save();

      const updatedData = await Project.findById(project._id);
      res.status(200).json({
        msg: "Output submission updated",
        data: updatedData,
      });
    } else {
      project = await Project.create({
        studentId: studentId,
        courseId: objectIdCourseId,
        instructorId: course.instructorId,
        courseTitle: course.title,
        instructorName: instructorName,
        studentName: student.fullName,
        studentOutput: req.file.path,
      });
      await StudentProgress.findOneAndUpdate(
        { studentId: studentId },
        { $inc: { progress: 1 } },
        { new: true }
      );
      if (project) {
        const insertedData = await Project.findById(project._id);
        res.status(201).json({
          msg: "Successfully submitted your output",
          data: insertedData,
        });
      } else {
        res.status(400).json({ msg: "Cannot upload output this time" });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: "Cannot upload output this time", error: error.message });
  }
};

const addCourseRating = async (req, res) => {
  const studentId = req.params.studentId;
  const { rating, courseId } = req.body;
  const objectIdCourseId = new mongoose.Types.ObjectId(courseId);

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const ratingValue = await Rating.create({
      studentId: studentId,
      courseId: objectIdCourseId,
      instructorId: course.instructorId,
      rating: rating,
    });

    if (ratingValue) {
      const insertedData = await Rating.findById(ratingValue._id);
      res.status(201).json({
        msg: `Data inserted with id ${ratingValue._id}`,
        data: insertedData,
      });
    } else {
      res.status(400).json({ msg: "Data not inserted" });
    }
  } catch (error) {
    throw error;
  }
};

const getCourseplanProgress = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const studentProgress = await StudentProgress.findOne({
      studentId: studentId,
    });

    res.status(200).json(studentProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getCoursePlan = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const courseplan = await CoursePlan.findOne({ studentId });

    if (!courseplan) {
      return res.status(404).json({ msg: "Courseplan not found" });
    }

    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $addFields: {
          averageRating: { $round: [{ $avg: "$ratings.rating" }, 0] },
          instructorName: { $arrayElemAt: ["$instructor.instructorName", 0] },
        },
      },
      {
        $project: {
          ratings: 0,
          instructor: 0,
        },
      },
    ]);

    const updatedCourseplan = courseplan.courseSet.map((category) => {
      const updatedCategory = {
        category: category.category,
        courses: courses.filter((course) =>
          category.courses.includes(course.title)
        ),
      };
      return updatedCategory;
    });

    const updatedData = {
      studentId: courseplan.studentId,
      curriculum: courseplan.curriculum,
      courseSet: updatedCourseplan,
      amountPaid: courseplan.amountPaid,
      dateEnrolled: courseplan.dateEnrolled,
    };

    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $addFields: {
          averageRating: { $round: [{ $avg: "$ratings.rating" }, 0] },
          instructorName: { $arrayElemAt: ["$instructor.instructorName", 0] },
        },
      },
      {
        $project: {
          ratings: 0,
          instructor: 0,
        },
      },
    ]);

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getCustomCourses = async (req, res) => {
  let studentId = req.params.studentId;
  try {
    const customCourses = await CustomCourse.find({ studentId: studentId });

    if (customCourses) {
      res.json(customCourses);
    } else {
      res.status(400).json({ msg: ` Student ${studentId} does not exists` });
    }
  } catch (error) {
    throw error;
  }
};

const addCoursetoCoursePlan = async (req, res) => {
  const studentId = req.params.studentId;
  const { category, course, amountPaid } = req.body;

  try {
    const coursePlan = await CoursePlan.findOneAndUpdate(
      { studentId: studentId },
      {
        $inc: { amountPaid: amountPaid },
        $addToSet: {
          courseSet: {
            category: category,
            courses: [course],
          },
        },
      },
      { new: true }
    );
    if (coursePlan) {
      await StudentProgress.findOneAndUpdate(
        { studentId: studentId },
        { $inc: { noOfCourses: 1 } },
        { new: true }
      );
      res.status(200).json({ msg: "Course successfully added to Course Plan" });
    } else {
      res.status(400).json({ msg: "You don't have enrolled course plan. Choose Add Custom instead" });
    }
  } catch (error) {
    res.status(500).json({ msg: "You don't have enrolled course plan. Choose Add Custom instead", error: error.message });
  }
};

const unenrollCourseplan = async (req, res) => {
  let studentId = req.params.studentId;

  try {
    await CoursePlan.findOneAndDelete({ studentId: studentId });
    await InstructorClass.deleteMany({ studentId: studentId });
    await CourseEnrolled.deleteMany({ studentId: studentId });
    await StudentProgress.findOneAndDelete({ studentId: studentId })
      .then(() => res.status(200).json({ msg: `Your enrollment has been canceled. Please be aware that any future enrollments will incur charges as appropriate.` }))
      .catch(() => res.status(400).json({ msg: "Sorry! Cannot unenroll this time" }));
  } catch (error) {
    res.status(500).json({ msg: "Cannot process enrollment this time", error: error.message });
  }
};

module.exports = {
  studentSignUp,
  enrollCoursePlan,
  addCoursetoCoursePlan,
  addCustomCourse,
  submitProject,
  addCourseRating,
  getCoursePlan,
  getCourseplanProgress,
  getCourses,
  getCustomCourses,
  unenrollCourseplan,
};
