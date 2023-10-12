const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a single category by id
router.get('/:id', categoryController.getCategoryById);

// Create a new category
router.post('/', categoryController.createCategory);

// Update a category by id
router.put('/:id', categoryController.updateCategoryById);

// Delete a category by id
router.delete('/:id', categoryController.deleteCategoryById);

module.exports = router;
