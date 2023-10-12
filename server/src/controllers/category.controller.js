const { Category } = require('../models/Category');

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { UserId: req.user.id } });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new category
exports.createCategory = async (req, res) => {
  const { type, name, description } = req.body;
  try {
    const newCategory = await Category.create({
      UserId: req.user.id,
      type,
      name,
      description,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (category) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE a category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (category) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
