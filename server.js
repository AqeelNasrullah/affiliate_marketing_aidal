require("dotenv").config();
const express = require('express');
const bp = require('body-parser');
const app = express();

app.use(bp.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs')

app.use("/login", require("./routes/login"))



app.get("/",(req,res)=>{
  res.render("index");
})

app.get("/Lifestyle",(req,res)=>{
  res.render("lifestyle")
})

app.get("/gifts",(req,res)=>{
  res.render("gifts")
})






const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Server up on port 3000");
})
