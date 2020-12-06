const express = require('express');
const verify = require('../middleware/verify');
const cloudinary = require("../handlers/cloudinary");
const upload = require("../handlers/multer")
const Thumbnail = require("../models/thumbnail");
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

router.post("/",verify,upload.single('image'),async (req,res)=>{
  if(!(req.auth=="valid")){
    res.redirect("/login")
    return
  }

  //Change thumbnail
  try{
  const thuu = await Thumbnail.findOne({id : 1});
  await cloudinary.uploader.destroy(thuu.cloudinary_id);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const thumb = Thumbnail.findOneAndUpdate({id : 1}, {cloudinary_id : result.public_id, url : result.secure_url},function(err){
    if(err){
      console.log(err);
    }
  })
  res.redirect("/dashboard")
}
catch(e){
  res.send(e.message);
}

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
