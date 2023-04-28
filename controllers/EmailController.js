const nodemailer = require("nodemailer");

const testAccount = nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: "smtp.ethereal.email",
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
  secure: false,
});

exports.sendEmail = (req, res) => {
  const mailOptions = {
    from: "labellapizza2021@gmail.com",
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully!");
    }
  });
};
