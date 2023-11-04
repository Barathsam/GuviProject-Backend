const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.nodemaileruser,
    pass: process.env.nodemailerpassword,
  },
});

function sendMail(toEmail, subject, content) {
  const mailoption = {
    from: "aceraspiremyself.p@gmail.com",
    to: toEmail,
    subject: subject,
    html: content,
  };
  transporter.sendMail(mailoption, (err, info) => {
    if (err) {
      console.err("error Occurred", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendMail };
