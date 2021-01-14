require("dotenv").config();
const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const verify = require("../middleware/verify");
const router = express.Router();
const key = process.env.SECERT_KEY;

router.get("/", verify, (req, res) => {
  if (req.auth == "valid") {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

router.post("/", async (req, res) => {
  try {
    console.log("hii");
    console.log(req.body);
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
      res.json({ mmessage: "Invalid Creds" });
      return;
    }
    const compared = await bycrypt.compare(user.password, password);
    // if (!compared) {
    //   res.json({ mmessage: "Invalid Creds" });
    //   return;
    // }
    const payload = {
      username: username,
    };
    console.log(key);

    const token = await jwt.sign(payload, key, { algorithm: "HS256" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/login");
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
