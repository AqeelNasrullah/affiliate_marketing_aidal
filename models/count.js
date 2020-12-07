const mongoose = require('mongoose');

const CountSchema = mongoose.Schema({
  total : Number,
  current_id : Number,
  id : Number
})

module.exports = mongoose.model("Count",CountSchema)
