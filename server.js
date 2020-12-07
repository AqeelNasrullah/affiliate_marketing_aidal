require("dotenv").config();
const express = require('express');
const bp = require('body-parser');
const cookie = require('cookie-parser');
const bycrypt = require('bcryptjs')
const app = express();
const User = require("./models/users");
const Thumbnail = require("./models/thumbnail")
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



app.get("/",async(req,res)=>{
  try{
  const thumbnail= await Thumbnail.findOne({id : 1});
  res.render("index",{thumbnail : thumbnail});
}
catch(e){
  console.log(e);
}
})

app.get("/Lifestyle",(req,res)=>{
  res.render("lifestyle")
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
// 7 kid


const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Server up on port 3000");
})
