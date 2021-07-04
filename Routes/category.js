const router = require("express").Router();
const Category = require("../Models/Category")

//Create Category
router.post('/create', async (req, res) => {
  try {
    const { body } = req;
    const newCat = new Category({ name: body.name });
    const category = await newCat.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
})

//Get All Category
router.get('/', async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
})

//delete Category
router.delete('/delete/:id', async (req, res) => {
  try {
    const { params } = req;
    await Category.findByIdAndDelete(params.id);
    res.status(200).json("deleted category");
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;