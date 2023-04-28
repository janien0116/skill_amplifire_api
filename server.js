require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

const logger = require("./middlewares/logger");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const studentRoutes = require("./routes/Students");
const instructorRoutes = require("./routes/Instructors");
const authenticationRoutes = require("./routes/Authentication");
const studentAuth = require("./middlewares/studentAuth");
const instructorAuth = require("./middlewares/instructorAuth");

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Succesfully connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

app.use("/api", authenticationRoutes);

app.use("/api/instructors" ,instructorAuth , instructorRoutes);

app.use("/api/students",studentAuth, studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
