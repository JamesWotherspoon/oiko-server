const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/category.controller');

// Get all categories
router.get('/', getCategories);

// Get a single category by id
router.get('/:id', getCategoryById);

// Create a new category
router.post('/', createCategory);

// Update a category by id
router.put('/:id', updateCategoryById);

// Delete a category by id
router.delete('/:id', deleteCategoryById);

module.exports = router;
