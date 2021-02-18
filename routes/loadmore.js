const express = require('express');
const Items = require("../models/items.js")
const mongoose = require("mongoose")

const router = express.Router();


router.post("/",async(req,res)=>{
  try{

  const count = req.body.count;
  const items = await Items.find().skip(count*12).limit(12).sort({id:-1});
  res.send(items);
}
catch(e){
  res.send(e.message);
}
})

router.post("/:category/:sub_category",async(req,res)=>{
  try{
    const count = req.body.count;
    const items = await Items.find({$and : [{category : req.params.category , sub_category : req.params.sub_category}]}).skip(count*4).limit(4).sort({id:-1});
    res.send(items);
  }
  catch(e){
    res.send(e)
  }
})


module.exports = router
