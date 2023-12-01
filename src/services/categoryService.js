const Category = require('../models/CategoryModel');
const { NotFoundError } = require('../utils/customErrorUtils');

const retrieve = async (userId, type) => {
  const whereClause = { userId };
  if (type) whereClause.type = type;

  const categories = await Category.findAll({ where: whereClause });

  return categories;
};

const retrieveById = async (userId, id) => {
  const whereClause = { userId, id };

  const category = await Category.findOne({ where: whereClause });

  if (!category) {
    throw new NotFoundError(`Category with ID: ${id} not found.`);
  }

  return category;
};

const create = async (userId, categoryData) => {
  const category = await Category.create({ ...categoryData, userId });
  return category;
};

const updateById = async (userId, id, categoryData) => {
  const whereClause = { userId, id };

  const updated = await Category.update(categoryData, {
    where: whereClause,
  });

  if (!updated || updated[0] === 0) {
    throw new NotFoundError(`Failed to update category with ID: ${id}`, 'UPDATE_FAILED');
  }
  const updatedItem = await Category.findOne({ where: whereClause });

  return updatedItem;
};

const deleteById = async (userId, id) => {
  const whereClause = { userId, id };

  const deleted = await Category.destroy({ where: whereClause });

  if (!deleted) {
    throw new NotFoundError(`Failed to delete category with ID: ${id}`, 'DELETE_FAILED');
  }

  return id;
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
