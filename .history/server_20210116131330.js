require("dotenv").config();
const express = require("express");
const bp = require("body-parser");
const cookie = require("cookie-parser");
const bycrypt = require("bcryptjs");
const verify = require("./middleware/verify");

const app = express();
const User = require("./models/users");
const Thumbnail = require("./models/thumbnail");
const Items = require("./models/items");
const Blog = require("./models/blog");
const mongoose = require("mongoose");
const methodOveride = require("method-override");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// app.locals.baseURL = "http://affiliate-marketing-aidal.herokuapp.com";

// app.locals.baseURL = "http://localhost:5000";

app.set("view engine", "ejs");
app.use(cookie());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOveride("_method"));
app.use("/login", require("./routes/login"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/edit", require("./routes/edit"));
app.use("/loadmore", require("./routes/loadmore"));
app.use("/changethumbnail", require("./routes/changethumbnail"));

app.get("/", async (req, res) => {
  alert(require('url'));
  // try {
  //   const thumbnail = await Thumbnail.findOne({ id: 1 });
  //   const items = await Items.find().sort({ id: -1 }).limit(12);
  //   res.render("index", { thumbnail: thumbnail, items: items });
  // } catch (e) {
  //   console.log(e);
  // }
});

async function findItems(category, subArray) {
  try {
    let items = [];
    for (let i = 0; i < subArray.length; i++) {
      let itemm = await Items.find({
        $and: [{ category: category, sub_category: subArray[i] }],
      })
        .limit(4)
        .sort({ id: -1 });
      items.push(...itemm);
    }
    return items;
  } catch (e) {
    res.send("Internal Server Error");
  }
}

app.get("/lifestyle", async (req, res) => {
  try {
    let sub = [
      "Clothing",
      "Home",
      "Beauty & Skincare",
      "Accessories",
      "Bath & Body",
      "Jewelry",
      "Kids",
    ];
    let items = await findItems("lifestyle", sub);
    res.render("lifestyle", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/gifts", async (req, res) => {
  let sub = ["GIFTS FOR HER", "GIFTS FOR HIM"];
  let items = await findItems("gift", sub);
  res.render("gifts", { items: items });
});

app.get("/stories", async (req, res) => {
  try {
    const items = await Blog.find().sort({ Date: -1 });
    res.render("stories", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/stories/:story", async (req, res) => {
  let ttl = req.params.story;
  const items = await Blog.find().sort({ Date: -1 });
  items.forEach(item => {
    if (item.name == ttl) {
      res.render("single-story", { story: item });
    }
  });
  res.send("404 not found");
});

app.get("/experiences", async (req, res) => {
  let sub = [
    "Europe",
    "Africa",
    "Asia",
    "America",
    "Antarctica",
    "Australasia",
  ];
  let items = await findItems("experience", sub);
  res.render("experiences", { items: items });
});

app.get("/shobycause", (req, res) => {
  res.render("shopbycause", { items: [] });
});

app.get("/addstory", verify, (req, res) => {
  res.render("add-story");
});

app.get("/:name", (req, res) => {
  res.send("404 not found");
});

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

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});
