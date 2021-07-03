const router = require("express").Router();
const User = require("../Models/User")
const bcrypt = require("bcrypt");

router.post('/register', async (req, res) => {
  try {
    const { body } = req;
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

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { body } = req;

    const user = await User.findOne({ username: body.username })
    !user && res.status(400).json("User does not exist");

    const validation = await bcrypt.compare(body.password, user.password)
    !validation && res.status(400).json("Wrong Credentials");

    const { password, ...other } = user._doc;

    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;