const express = require("express");
const { AthenticateUser } = require("../controllers/Login");
const client = require("../redis");
const router = express.Router();

client
  .connect()
  .then(() => {
    console.log("Connected to redis");
  })
  .catch((e) => {
    console.log(e);
  });

router.post("/", async function (req, res) {
  try {
    const { email, password } = req.body;
    let loginCredentials = await AthenticateUser(email, password);
    console.log(loginCredentials);
    if (loginCredentials === "invalid user or password") {
      res.status(200).send("invalid user or password");
    } else if (loginCredentials === "server busy") {
      res.status(200).send("server busy");
    } else {
      res.status(200).json({ token: loginCredentials.token });
    }
  } catch (e) {
    console.error(e);
  }
});
module.exports = router;
