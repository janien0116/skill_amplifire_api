const Course = require("../models/Course");
const InstructorClass = require("../models/InstructorClass");
const Project = require("../models/Project");
const Instructor = require("../models/Instructor");
const mongoose = require("mongoose");
const path = require("path");
const CoursePlan = require("../models/CoursePlan");
const CourseEnrolled = require("../models/CourseEnrolled");
const Rating = require("../models/Rating");

const addCourse = async (req, res) => {
  console.log(req.params);
  const instructorId = req.params.instructorId;
  const {
    title,
    description,
    curriculum,
    category,
    level,
    outputDescription,
    outputLink,
    amount,
  } = req.body;

  try {
    const course = await Course.create({
      instructorId: instructorId,
      videoThumbnail: req.file.path,
      title: title,
      description: description,
      curriculum: curriculum,
      category: category,
      level: level,
      outputDescription: outputDescription,
      outputLink: outputLink,
      amount: amount,
    });

    if (course) {
      const insertedData = await Course.findById(course._id);
      res.status(201).json({
        msg: "Course added successfully",
        data: insertedData,
      });
    } else {
      res.status(400).json({ msg: "Cannot add course. Please complete all fields" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Cannot add course. Please complete all fields", error: error.message });
  }
};

const getInstructor = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const instructor = await Instructor.findById(instructorId);

    if (instructor) {
      res.status(200).json(instructor);
    } else {
      res.status(400).json({ msg: `Instructor does not exists` });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const courses = await Course.aggregate([
      {
        $match: {
          instructorId: new mongoose.Types.ObjectId(instructorId),
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
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
        },
      },
      {
        $addFields: {
          instructorName: { $arrayElemAt: ["$instructor.instructorName", 0] },
          averageRating: { $round: [{ $avg: "$ratings.rating" }, 0] },
        },
      },
      {
        $project: {
          ratings: 0,
          instructor: 0,
        },
      },
    ]);
    if (courses) {
      res.status(200).json(courses);
    } else {
      res.status(400).json({ msg: `Course/s does not exists` });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getStudentsByInstructor = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const students = await InstructorClass.find({ instructorId: instructorId });

    if (students) {
      // const uniqueStudentIds = students.reduce((uniqueIds, student) => {
      //   if (!uniqueIds.includes(student.studentName)) {
      //     uniqueIds.push(student.studentName);
      //   }
      //   return uniqueIds;
      // }, []);
      res.status(200).json(students);
    } else {
      res.status(400).json({ msg: `No students in class` });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getStudentOutputs = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const outputs = await Project.find({ instructorId: instructorId });

    if (outputs) {
      const formattedOutputs = outputs.map((output) => {
        return {
          ...output.toObject(),
          downloadLink: `${output.studentOutput}`,
        };
      });
      res.status(200).json(formattedOutputs);
    } else {
      res.status(400).json({ msg: `No students in class` });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getEnrolledStudents = async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    const result = await CourseEnrolled.aggregate([
      {
        $match: {
          instructorId: new mongoose.Types.ObjectId(instructorId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$dateEnrolled" } },
            month: { $month: { $toDate: "$dateEnrolled" } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getRevenue = async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    const result = await CourseEnrolled.aggregate([
      {
        $match: {
          instructorId: new mongoose.Types.ObjectId(instructorId),
        },
      },
      {
        $group: {
          _id: "$courseTitle",
          totalRevenue: { $sum: "$amountPaid" },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRevenue" },
          courses: {
            $push: {
              courseTitle: "$_id",
              totalRevenue: "$totalRevenue",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          courses: 1,
          totalRevenue: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const getRatings = async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    const result = await Rating.aggregate([
      {
        $match: {
          instructorId: new mongoose.Types.ObjectId(instructorId),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          rating: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          rating: -1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  let instructorId = req.params.instructorId;

  try {
    await Course.findOneAndDelete({ instructorId: instructorId })
      .then(() => res.status(200).json({ msg: `Course deleted` }))
      .catch(() => res.status(400).json({ msg: "Error deleting course" }));
  } catch (error) {
    res.status(500).json({ msg: "Error deleting course", error: error.message });
  }
};

module.exports = {
  addCourse,
  getInstructor,
  getCoursesByInstructor,
  getStudentsByInstructor,
  getStudentOutputs,
  getEnrolledStudents,
  getRevenue,
  getRatings,
  deleteCourse
};
