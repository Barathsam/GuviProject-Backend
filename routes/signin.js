const express = require("express");
const { CheckUser } = require("../controllers/Login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controllers/signin");
const router = express.Router();

router.get("/:token", async function (req, res) {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(response);
  } catch (e) {
    console.error(e);
    res.status(500).send(
      `<html>
        <body>
          <h4>Hi,There</h4>
          <h5>Registeration Failed</h5>
          <p>link expired</p>
          <p>regards</p>
          <p>Team</p>
        </body>
      </html>`
    );
  }
});
router.post("/verify", async function (req, res) {
  try {
    const { name, email, password } = await req.body;
    console.log(name, email, password);
    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password);
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send(false);
    } else if (registerCredentials === "server busy") {
      res.status(500).send("server busy");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
