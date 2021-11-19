const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Status = require('../Constants/Request_Status')
dotenv.config();

function auth(req, res, next){
  const token = req.header('Authorization');
  //check if token exists
  if(!token) res.status(Status.UNAUTHORIZED).json({message:"Unauthorized"});
  try{
    // verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  }catch(e){
    res.status(Status.INTERNAL_SERVER_ERROR).json({message:e})
  }
}

module.exports = auth;