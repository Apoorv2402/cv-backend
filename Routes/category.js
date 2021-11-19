const router = require("express").Router();
const Category = require("../Models/Category");
const auth = require("../middleware/authorization");
const Status = require('../Constants/Request_Status');

//Create Category
router.post('/create',auth, async (req, res) => {
  try {
    const { body } = req;
    const newCat = new Category({ name: body.name });
    const category = await newCat.save();
    res.status(Status.OK).json(category);
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
})

//Get All Category
router.get('/', async (req, res) => {
  try {
    const category = await Category.find();
    res.status(Status.OK).json(category);
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
})

//delete Category
router.delete('/delete/:id',auth, async (req, res) => {
  try {
    const { params } = req;
    await Category.findByIdAndDelete(params.id);
    res.status(Status.OK).json("deleted category");
  } catch (error) {
    res.status(Status.INTERNAL_SERVER_ERROR).json(error);
  }
})

module.exports = router;


