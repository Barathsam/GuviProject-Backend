const express = require("express");
const cors = require("cors");

const app = express();
const connectDb = require("./db");
const signinrouter = require("./routes/signin");
const loginrouter = require("./routes/login");
const homerouter = require("./routes/home");

const port = 4000;
connectDb();
app.use(express.json());
app.use(cors());
app.use("/signin", signinrouter);
app.use("/login", loginrouter);
app.use("/home", homerouter);

app.get("/", function (req, res) {
  res.send("Welcome");
});
app.listen(port, function () {
  console.log("Connected to port 4000");
});
