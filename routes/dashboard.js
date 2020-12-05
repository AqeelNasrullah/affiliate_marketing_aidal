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

router.post("/",verify,(req,res)=>{
  if(!(req.auth=="valid")){
    res.redirect("/login")
    return
  }

  //Change thumbnail


})

router.get("/add",verify,(req,res)=>{
  if(!(req.auth=="valid")){
    res.redirect("/login")
    return
  }
  res.render("add")
})

router.post("/add",verify,(req,res)=>{
  if(!(req.auth=="valid")){
    res.redirect("/login")
    return
  }
  //Add new item
})


module.exports = router;
