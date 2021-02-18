const mongoose = require("mongoose");

const thumbnailSchema = mongoose.Schema({
  id : Number,
  cloudinary_id : String,
  url : String
})

module.exports = mongoose.model("Thumbnails",thumbnailSchema);
