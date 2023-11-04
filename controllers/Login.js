const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../redis");

require("dotenv").config();

async function CheckUser(email) {
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("server busy", err);
  }
}

async function AthenticateUser(email, password) {
  try {
    const userCheck = await User.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, userCheck.password);
    if (validPassword) {
      const token = jwt.sign({ email }, process.env.loginsecrettoken);
      const response = {
        id: userCheck.id,
        name: userCheck.name,
        email: userCheck.email,
        token: token,
        status: true,
      };
      await client.set(`key-${email}`, JSON.stringify(response));
      await User.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: token } },
        { new: true }
      );
      return response;
    }
    return "invalid user or password";
  } catch (e) {
    console.error(e);
    return "server busy";
  }
}

async function AuthorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.loginsecrettoken);
    if (decodedToken) {
      const email = decodedToken.email;
      const auth = await client.get(`key-${email}`);
      if (auth) {
        const data = JSON.parse(auth);
        console.log("gg", data);
        return data;
      } else {
        const data = await User.findOne({ email: email });
        return data;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { CheckUser, AthenticateUser, AuthorizeUser };
