const express = require("express");
const verify = require("../middleware/verify");
const cloudinary = require("../handlers/cloudinary");
const upload = require("../handlers/multer");
const Thumbnail = require("../models/thumbnail");
const Blog = require("../models/blog");
const parser = require("htmltemplate-parser");

const Item = require("../models/items");
const Count = require("../models/count");
const { htmlToText } = require("html-to-text");
const router = express.Router();

router.get("/", verify, async (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }
  try {
    const status = await Count.findOne({ id: 1 });
    const items = await Item.find().sort({ id: -1 }).limit(5);
    res.render("dashboard", { count: status.total, items: items });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/allpost", async (req, res) => {
  try {
    const items = await Item.find().sort({ id: -1 });
    res.render("searchAdmin", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.post("/", verify, upload.single("image"), async (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }

  //Change thumbnail
  try {
    const thuu = await Thumbnail.findOne({ id: 1 });
    await cloudinary.uploader.destroy(thuu.cloudinary_id);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const thumb = await Thumbnail.findOneAndUpdate(
      { id: 1 },
      { cloudinary_id: result.public_id, url: result.secure_url },
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e.message);
  }
});

// router.post("/",upload.single('image'),(req,res)=>{
//   res.send(req.body);
// })

router.post("/search", async (req, res) => {
  try {
    const items = await Item.find(
      { name: { $regex: req.body.search, $options: "i" } },
      err => {
        if (err) {
          console.log(err);
        }
      }
    ).sort({ id: -1 });
    res.render("searchAdmin", { items: items });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/add", verify, (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }
  res.render("add");
});

router.post("/add", verify, upload.single("image"), async (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }
  //Add new item
  try {
    const status = await Count.findOne({ id: 1 });
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      quality: "auto",
      fetch_format: "auto",
      crop: "scale",
    });
    const item = new Item({
      id: status.current_id + 1,
      name: req.body.title,
      desc: req.body.description,
      price: req.body.price,
      category: req.body.category,
      sub_category: req.body.sub,
      link: req.body.link,
      cloudinary_id: result.public_id,
      thumbnail: result.secure_url,
    });

    await Count.findOneAndUpdate(
      { id: 1 },
      { total: status.total + 1, current_id: status.current_id + 1 },
      function (err) {
        if (err) {
          res.send(err);
          return;
        }
      }
    );
    await item.save();
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e.message);
  }
});
router.post("/addblog", verify, upload.single("image"), async (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }
  //Add new item
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      quality: "auto",
      fetch_format: "auto",
      crop: "scale",
    });
    const text = htmlToText(req.body.description);
    const item = new Blog({
      name: req.body.title,
      desc: text,
      category: req.body.category,
      cloudinary_id: result.public_id,
      thumbnail: result.secure_url,
    });

    await item.save();
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e.message);
  }
});

router.delete("/:id", verify, async (req, res) => {
  if (!(req.auth == "valid")) {
    res.redirect("/login");
    return;
  }
  try {
    const count = await Count.findOne({ id: 1 });
    await Count.findOneAndUpdate({ id: 1 }, { total: count.total - 1 });
    const item = await Item.findOne({ id: req.params.id });
    await cloudinary.uploader.destroy(item.cloudinary_id);
    await Item.findOneAndDelete({ id: req.params.id });
    res.redirect("/dashboard");
  } catch (e) {
    res.send(e.message);
  }
});
// {"title":"Facebook is a global threat","price":"10","category":"lifestyle","sub":"sdasd","link":"https://dropgalaxy.in/tw0ke4hkbuoi","description":"sdasda","button":""}

module.exports = router;
