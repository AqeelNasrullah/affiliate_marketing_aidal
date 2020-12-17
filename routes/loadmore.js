const express = require('express');
const Items = require("../models/items.js")
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




module.exports = router
