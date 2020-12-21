require("dotenv").config();
const express = require('express');
const bp = require('body-parser');
const cookie = require('cookie-parser');
const bycrypt = require('bcryptjs')
const app = express();
const User = require("./models/users");
const Thumbnail = require("./models/thumbnail");
const Items = require("./models/items")
const mongoose = require("mongoose")
const methodOveride = require("method-override");

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex : true, useFindAndModify : false});

app.set('view engine','ejs')
app.use(cookie());
app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOveride('_method'))
app.use("/login", require("./routes/login"))
app.use("/dashboard",require("./routes/dashboard"))
app.use("/edit",require("./routes/edit"))
app.use("/loadmore",require("./routes/loadmore"))


app.get("/",async(req,res)=>{
  try{
  const thumbnail= await Thumbnail.findOne({id : 1});
  const items = await Items.find().sort({id:-1}).limit(12);
  res.render("index",{thumbnail : thumbnail , items : items});
}
catch(e){
  console.log(e);
}
})

app.get("/Lifestyle",async(req,res)=>{
  try{
    let items = [];
    let item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Clothing"}]}).limit(4).sort({id:-1});
    items.push(...item);
    item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Home"}]}).limit(4).sort({id:-1});
    items.push(...item);
    item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Beauty & Skincare"}]}).limit(4).sort({id:-1});
    items.push(...item);
    item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Accessories"}]}).limit(4).sort({id:-1});
    items.push(...item);
    item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Bath & Body"}]}).limit(4).sort({id:-1});
    items.push(...item);
    item = await Items.find({$and : [ {category : 'lifestyle' , sub_category:"Jewelry"}]}).limit(4).sort({id:-1});
    items.push(...item);
    res.render("lifestyle",{items : items})
  }
  catch(e){
    res.send(e.message)
  }
})

app.get("/gifts",(req,res)=>{
  res.render("gifts")
})

app.get("/:name",(req,res)=>{
  res.send("404 not found")
})

// app.get("/register",async (req,res)=>{
//   try{
//
//   const username = "aida";
//   let password = "Myaccount1";
//   const salt = await bycrypt.genSalt(10);
//   password = await bycrypt.hash(password,salt);
//
//   const user = new User({
//     username : username,
//     password : password
//   })
//
//   user.save();
//   res.redirect("/login")
// }
// catch(e){
//   res.send(e.message);
// }
// })

//
//
// 1 clothin
// 2 beauty&skin
// 3 bath
// 4 Remove thera
// 5 acces
// 6 home
// 7 Books
// 8 kid


const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Server up on port 3000");
})
