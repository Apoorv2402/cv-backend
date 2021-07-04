const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function auth(req, res, next){
  const token = req.header('authorization');

  //check for token
  if(!token) res.status(401).json({message:"Authorization denied"});

  try{
    // verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  }catch(e){
    res.status(500).json({message:e})
  }
}

module.exports = auth;