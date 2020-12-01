const express = require('express');
const verify = require('../middleware/verify')
const router = express.Router();

router.get("/",verify,(req,res)=>{
  if(!(req.auth=="valid")){
    res.redirect("/login")
    return
  }
  res.render("dashboard")
})

router.get("/logout",async(req,res)=>{
  res.clearCookie("token");
  res.redirect("/login")
})


module.exports = router;
