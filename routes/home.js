const express = require("express");
const { AuthorizeUser } = require("../controllers/Login");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    let auth_token = await req.headers.authorization;
    const loginCredentials = await AuthorizeUser(auth_token);
    if (loginCredentials === false) {
      res.status(200).send("Invalid token");
    } else {
      res.json(loginCredentials);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("server busy");
  }
});

module.exports = router;
