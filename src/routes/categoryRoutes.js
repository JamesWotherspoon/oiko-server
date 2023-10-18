const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categoryController');
const validate = require('../middleware/validateMiddleware');
const { querySchema, bodySchema } = require('../api-schemas/categoryApiSchema');

// Get all categories
router.get('/', validate('query', querySchema), getCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Set category
router.post('/', validate('body', bodySchema), createCategory);

// Update category
router.put('/:id', validate('body', bodySchema), updateCategoryById);

// Delete category
router.delete('/:id', deleteCategoryById);

module.exports = router;
