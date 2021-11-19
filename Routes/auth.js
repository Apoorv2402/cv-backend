const router = require("express").Router();
const User = require("../Models/User")
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authorization");
const Status = require('../Constants/Request_Status');

dotenv.config();

router.post('/register', async (req, res) => {
  const { body } = req;
  const checkUser = await User.findOne({username: body.username})
  if( checkUser && checkUser._doc ){
    return res.status(Status.BAD_REQUEST).json({message:"Username already taken"})
  } 
  const checkEmail = await User.findOne({ email: body.email})
  if( checkEmail && checkEmail._doc ){
    return res.status(Status.BAD_REQUEST).json({message:"Account with this email already exists"})
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
      //token expiry 14 days
      { expiresIn: (3600 * 24 * 14) }, 
      (err, token) => {
        if (err) return res.status(Status.BAD_REQUEST).json({ message : err })
        const { password, ...response } = user._doc;
      return res.status(Status.OK).json({ user: response, token: token });
    });
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { body } = req;
    if(!body.username || !body.password) {
      return res.status(Status.BAD_REQUEST).json({message:"Enter all credentials"})
    };
    
    let user;
    user = await User.findOne({ username: body.username });

    if(!user){
      user = await User.findOne({ email: body.username });
    }

    !user && res.status(Status.BAD_REQUEST).json({message:"User does not exist"});
    
    const validation = await bcrypt.compare(body.password, user.password)
    !validation && res.status(Status.BAD_REQUEST).json({message:"Wrong Credentials"});
    
    let id = user._id;
    jwt.sign({id} , process.env.ACCESS_TOKEN_SECRET, 
      // token expires in 14 days
      { expiresIn: (3600 * 24 * 14) }, 
      (err, token) => {
        if (err) return res.status(Status.BAD_REQUEST).json({ message : err });

        const { password, ...response } = user._doc;
      return res.status(Status.OK).json({ user: response, token: token });
    }); 
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
})

router.get('/user',auth,(req,res) => {
  User.findById(req.user.id)
  .select('-password')
  .then(user => res.json(user));
})

module.exports = router;