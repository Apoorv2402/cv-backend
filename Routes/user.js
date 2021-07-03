const router = require("express").Router();
const User = require("../Models/User")
const Post = require("../Models/Post")
const bcrypt = require("bcrypt");


router.get('/details/:id',async(req,res)=>{
  const { body, params } = req;
  try{
    const user = await User.findById(params.id);
    const {password, ...response }= user._doc;
    res.status(200).json(response);
  }
  catch(error){
    res.status(404).json(error);
  }
});



router.put('/update/:id', async (req, res) => {
  const { body, params } = req;
  if (body.userId === params.id) {
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(params.id, {
        $set: body,
      })
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    res.status(401).json("Unauthorised");
  }
})

router.delete('/delete/:id', async (req, res) => {
  const { body, params } = req;
  if (body.userId === params.id) {
    try{
      const user = await User.findById(params.id);
      try {
        await Post.deleteMany({username: user.username})
        await User.findByIdAndDelete(params.id)
        res.status(200).json("User data deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    }catch{
      res.status(404).json("User not fount");
    }
  }
  else {
    res.status(401).json("Unauthorised");
  }
})

module.exports = router;