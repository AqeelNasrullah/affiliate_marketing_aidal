require("dotenv").config();
const express = require('express');
const bp = require('body-parser');
const cookie = require('cookie-parser');
const bycrypt = require('bcryptjs')
const app = express();
const User = require("./models/users")
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex : true, useFindAndModify : false});
app.use(cookie());
app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs')

app.use("/login", require("./routes/login"))
app.use("/dashboard",require("./routes/dashboard"))



app.get("/",(req,res)=>{
  res.render("index");
})

app.get("/Lifestyle",(req,res)=>{
  res.render("lifestyle")
})

app.get("/gifts",(req,res)=>{
  res.render("gifts")
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






const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Server up on port 3000");
})
