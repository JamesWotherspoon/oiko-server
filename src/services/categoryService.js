const Category = require('../models/CategoryModel');
const { NotFoundError } = require('../utils/customErrorUtils');

const retrieve = async (userId, type) => {
  try {
    const whereClause = { userId };
    if (type) whereClause.type = type;

    const categories = await Category.findAll({ where: whereClause });

    return categories;
  } catch (error) {
    next(error);
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    const category = await Category.findOne({ where: whereClause });

    if (!category) {
      throw new NotFoundError(`Category with ID: ${id} not found.`);
    }

    return category;
  } catch (error) {
    next(error);
  }
};

const create = async (userId, categoryData) => {
  try {
    const category = await Category.create({ ...categoryData, userId });
    return category;
  } catch (error) {
    next(error);
  }
};

const updateById = async (userId, id, categoryData) => {
  try {
    const whereClause = { userId, id };

    const updated = await Category.update(categoryData, {
      where: whereClause,
    });

    if (!updated || updated[0] === 0) {
      throw new NotFoundError(`Failed to update category with ID: ${id}`, 'UPDATE_FAILED');
    }

    return updated;
  } catch (error) {
    next(error);
  }
};

const deleteById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    const deleted = await Category.destroy({ where: whereClause });

    if (!deleted) {
      throw new NotFoundError(`Failed to delete category with ID: ${id}`, 'DELETE_FAILED');
    }

    return deleted;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
