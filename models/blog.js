const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
  name: String,
  desc: String,
  cloudinary_id: String,
  thumbnail: String,
  category: String,
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("blog", BlogSchema);
