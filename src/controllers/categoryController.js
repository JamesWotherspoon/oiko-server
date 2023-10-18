const Category = require('../models/CategoryModel');

const getCategories = async (req, res, next) => {
  try {
    const whereClause = { userId: req.user.id };
    const type = req.query.type;
    if (type) whereClause.type = type;
    const categories = await Category.findAll({ where: whereClause });

    if (categories.length !== 0) {
      res.status(200).json(categories);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed fetching categories. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Fetch a specific category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const category = await Category.findOne({ where: whereClause });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed fetching category with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const createObj = { ...req.body, userId: req.user.id };
    const category = await Category.create(createObj);
    res.status(201).json(category);
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed creating category. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Update a category by ID
const updateCategoryById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };

    const updated = await Category.update(req.body, {
      where: whereClause,
    });

    if (updated.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed updating category with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const deleted = await Category.destroy({ where: whereClause });

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed deleting category with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
