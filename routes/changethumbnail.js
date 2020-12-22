const express = require("express");
const Items = require("../models/items")
const verify = require('../middleware/verify');
const cloudinary = require("../handlers/cloudinary");
const upload = require("../handlers/multer")
const router = express.Router();

router.get("/:id",(req,res)=>{
  res.render("change",{item_id : req.params.id})
})

router.post("/:id",upload.single("image"),async(req,res)=>{
  try{
  const thuu = await Items.findOne({id : req.params.id});
  await cloudinary.uploader.destroy(thuu.cloudinary_id);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await Items.findOneAndUpdate({id : req.params.id}, {cloudinary_id : result.public_id, thumbnail : result.secure_url},function(err){
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

module.exports = router;
