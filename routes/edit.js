const express = require('express');
const Items = require("../models/items")
const verify = require("../middleware/verify")

const router = express.Router();

router.get("/:id",verify,async(req,res)=>{
  try{
    const item = await Items.findOne({id : req.params.id});
    res.render("edit",{item : item});
  }
  catch(e){
    res.send(e.message)
  }

})

router.post("/:id",verify,async(req,res)=>{
  try{

  await Items.findOneAndUpdate({id: req.params.id},{
    name : req.body.title,
    desc : req.body.description,
    price : req.body.price,
    sub_category : req.body.sub,
    link : req.body.link,
    category : req.body.category
  },function(err){
    if(err){
      res.send(err)
      return;
    }
  })
  res.redirect("/dashboard")
}
catch(e){
  res.send(e.message)
}
})

module.exports = router;
