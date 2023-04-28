const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const studentAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .send({ error: "Please provide a valid access token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_TOKEN);
    const student = await Student.findOne({
      _id: decoded._id,
      accessToken: token,
    });

    if (!student) {
      throw new Error();
    }

    req.token = token;
    req.student = student;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate as a student" });
  }
};

module.exports = studentAuth;
