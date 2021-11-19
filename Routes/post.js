const router = require("express").Router();
const Post = require("../Models/Post");
const auth = require("../middleware/authorization");
const Status = require('../Constants/Request_Status');

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
    res.status(Status.OK).json(post)
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error)
  }
});

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
      res.status(Status.OK).json(updatedPost)
    }else{
      res.status(Status.NOT_FOUND).json("Authentication error");
    }
  } catch (err) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Delete Post
router.delete('/delete',auth, async (req, res) => {
  try {
    const { body, query } = req;
    const post = await Post.findById(query.pid);
    if(post.username === body.username){
      await Post.findByIdAndDelete(query.pid);
      res.status(Status.OK).json("Post deleted");
    }else{
      res.status(Status.NOT_FOUND).json("Authentication error");
    }
  } catch (err) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(err);
  }
});

// Get post by id
router.get('/:id', async (req, res) => {
  try{
    const { params } = req;
    const post = await Post.findById(params.id)
    res.status(Status.OK).json(post);
  }catch(err){
    res.status(Status.INTERNAL_SERVER_ERROR).json(err)
  }
});

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
    res.status(Status.OK).json(post);
  }catch(err){
    res.status(Status.BAD_REQUEST).json(err)
  }
});


module.exports = router;