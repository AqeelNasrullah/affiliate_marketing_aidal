const mongoose = require("mongoose");

const ItemsSchema = mongoose.Schema({
  id : Number,
  name : String,
  desc : String,
  price : String,
  cloudinary_id : String,
  thumbnail : String,
  category : String,
  sub_category : String,
  link : String,
});

module.exports = mongoose.model('Items',ItemsSchema);
