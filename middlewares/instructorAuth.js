const jwt = require("jsonwebtoken");
const Instructor = require("../models/Instructor");

const instructorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_TOKEN);
    const instructor = await Instructor.findOne({
      _id: decoded._id,
      accessToken: token,
    });

    if (!instructor) {
      throw new Error();
    }

    req.token = token;
    req.instructor = instructor;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate as an instructor" });
  }
};

module.exports = instructorAuth;
