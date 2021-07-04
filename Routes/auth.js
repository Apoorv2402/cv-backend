const router = require("express").Router();
const User = require("../Models/User")
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

router.post('/register', async (req, res) => {
  const { body } = req;

  const checkUser = await User.findOne({username: body.username})
  if( checkUser && checkUser._doc ){
    return res.status(400).json({message:"Username already taken"})
  } 
  const checkEmail = await User.findOne({ email: body.email})
  if( checkEmail && checkEmail._doc ){
    return res.status(400).json({message:"Account with this email already exists"})
  } 

  try {
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    
    const newUser = new User({
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      password: hashedPassword,
      usertype: body.usertype,
      pincode: body.pincode,
      profilePicture: body.profilePicture,
    })

    const user = await newUser.save();
    let id = user._id;
    
    jwt.sign({id} , process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: (3600 * 24) }, 
      (err, token) => {
        if (err) return res.status(400).json({ message : err })
        
        const { password, ...response } = user._doc;
      return res.status(200).json({ user: response, token: token });
    });
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { body } = req;
    if(!body.username || !body.password) return res.status(400).json({message:"Enter all credentials"})
    
    const user = await User.findOne({ username: body.username })
    !user && res.status(400).json({message:"User does not exist"});
    
    const validation = await bcrypt.compare(body.password, user.password)
    !validation && res.status(400).json({message:"Wrong Credentials"});
    
    let id = user._id;
    jwt.sign({id} , process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: (3600 * 24) }, 
      (err, token) => {
        if (err) return res.status(400).json({ message : err })
        
        const { password, ...response } = user._doc;
      return res.status(200).json({ user: response, token: token });
    }); 
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;