const { sendMail } = require("./SendMail");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verifyUser = require("../models/verifyuser");
require("dotenv").config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hasedPassword,
      token: token,
    });

    const activationLink = `http://localhost:4000/signin/${token}`;
    const content = `<h4>Hi,There</h4> <h5>Welcome to the App</h5><p>Thankyou for signing up click on the below link to activate</p>
    <a href="${activationLink}">click here</a>
    <p>regards</p>
    <p>Team</p>`;

    await newUser.save();
    sendMail(email, "verifyUser", content);
  } catch (err) {
    console.error(err);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

async function InsertSignUpUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4>Hi,There</h4> 
    <h5>You are Successfully registered</h5>
    <p>Welcome to the App</p>
    <p>regards</p>
    <p>Team</p>`;
      sendMail(newUser.email, "Registeration successfull", content);
      return `<h4>Hi,There</h4> 
    <h5>You are Successfully registered</h5>
    <p>Welcome to the App</p>
    <p>regards</p>
    <p>Team</p>`;
    }
    return `<h4>Hi,There</h4> 
    <h5>Registeration Failed</h5>
    <p>Link Expired.......</p>
    <p>regards</p>
    <p>Team</p>`;
  } catch (error) {
    console.error(error);
    return `
    <html>
    <body>
    <h4>Hi,There</h4> 
    <h5>Registeration Failed</h5>
    <p>Unexpected error</p>
    <p>regards</p>
    <p>Team</p>
    </body>
    </html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };
