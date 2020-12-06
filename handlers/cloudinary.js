const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name : 'aidal',
  api_key : '172547113657732',
  api_secret : '6b_TfWwx7Mdhwwvgnovq_1vj9VM'
})

module.exports = cloudinary;
