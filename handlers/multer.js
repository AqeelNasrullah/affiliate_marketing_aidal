const multer = require('multer');


module.exports = multer({
  storage : multer.diskStorage({}),
  fileFilter : (req,file,cb) =>{
    if(!file.mimetype.match(/jpg|jpeg|png|gif|webp|svg$i/)){
      cb(new Error("File not supported", false))
      return;
    }
    cb(null,true);
  }
})
