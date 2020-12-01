const jwt = require("jsonwebtoken")

module.exports =async  function(req,res,next){
  const token = req.cookies.token;
  if(!token){
    req.auth = "Not allowed";
    next();
  }
  else{
    try{
      const decode = await jwt.verify(token, process.env.SECERT_KEY , {algorithm : 'HS256'})
      req.dataa = decode;
      req.auth = "valid"
      next();
    }
    catch(e){
      console.log(e.message);
      req.auth = "Not allowed";
      next();
    }

  }
}
