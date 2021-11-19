const router = require("express").Router();
const User = require("../Models/User")
const Post = require("../Models/Post")
const bcrypt = require("bcrypt");
const auth = require("../middleware/authorization");
const Status = require('../Constants/Request_Status');
const { OK } = require("../Constants/Request_Status");

router.get('/details/:id',async(req,res)=>{
  const { body, params } = req;
  try{
    const user = await User.findById(params.id);
    const {password, ...response }= user._doc;
    res.status(Status.OK).json(response);
  }
  catch(error){
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
});

router.put('/update/:id', auth, async (req, res) => {
  const { body, params, user } = req;
  if (user.id === params.id) {
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(params.id, {
        $set: body,
      })
      res.status(Status.OK).json(updatedUser);
    } catch (err) {
      res.status(Status.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  else {
    res.status(Status.UNAUTHORIZED).json("Unauthorised");
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  const { body, params, user } = req;
  if (user.id === params.id) {
    try{
      const selectedUser = await User.findById(params.id);
      try {
        await Post.deleteMany({username: selectedUser.username})
        await User.findByIdAndDelete(params.id)
        res.status(Status,OK).json("User data deleted");
      } catch (err) {
        res.status(Status.INTERNAL_SERVER_ERROR).json(err);
      }
    }catch{
      res.status(Status.NOT_FOUND).json("User not found");
    }
  }
  else {
    res.status(Status.UNAUTHORIZED).json("Unauthorised");
  }
})

module.exports = router;