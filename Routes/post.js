const router = require("express").Router();
const Post = require("../Models/Post")
const auth = require("../middleware/authorization")

// Create Post
router.post('/create',auth, async (req, res) => {
  try {
    const { body } = req;
    const newPost = new Post({
      title: body.title,
      description: body.description,
      username: body.username,
      category: body.category,
      postPicture: body.postPicture,
    })
    const post = await newPost.save();
    res.status(200).json(post)
  } catch (error) {
    res.status(500).json(error)
  }
})

//Update Post
router.put('/update',auth, async (req, res) => {
  try {
    const { body, query } = req;
    const post = await Post.findById(query.pid)
    console.log(post)
    if(post.username === body.username){
      let updatedPost = await Post.findByIdAndUpdate(query.pid,{
        ...body
      },{new:true})
      res.status(200).json(updatedPost)
    }else{
      res.status(404).json("Authentication error");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

// Delete Post
router.delete('/delete',auth, async (req, res) => {
  try {
    const { body, query } = req;
    const post = await Post.findById(query.pid);
    if(post.username === body.username){
      await Post.findByIdAndDelete(query.pid);
      res.status(200).json("Post deleted");
    }else{
      res.status(404).json("Authentication error");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

// Get post by id
router.get('/:id', async (req, res) => {
  try{
    const { params } = req;
    const post = await Post.findById(params.id)
    res.status(200).json(post);
  }catch(err){
    res.status(500).json(err)
  }
})

// Get All posts
router.get('/', async (req, res) => {
  try{
    const { query } = req;
    let username = query.author;
    let catName = query.cat
    let post;
    if(username){
       post = await Post.find({username})
    }else if(catName){
       post = await Post.find({
        category:{
          $in:[catName]
        }
      })
    }else{
      post = await Post.find();
    }
    res.status(200).json(post);
  }catch(err){
    res.status(400).json(err)
  }
})


module.exports = router;