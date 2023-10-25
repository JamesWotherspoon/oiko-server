const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categoryController');
const sanitizeAndValidate = require('../middleware/sanitizeAndValidateMiddleware');
const { querySchema, bodySchema } = require('../api-schemas/categoryApiSchema');

// Get all categories
router.get('/', sanitizeAndValidate('query', querySchema), getCategories);

// Get category by ID
router.get('/:id', getCategoryById);

// Set category
router.post('/', sanitizeAndValidate('body', bodySchema), createCategory);

// Update category
router.put('/:id', sanitizeAndValidate('body', bodySchema), updateCategoryById);

// Delete category
router.delete('/:id', deleteCategoryById);

module.exports = router;
