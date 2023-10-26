const Category = require('../models/CategoryModel');

const retrieve = async (userId, type) => {
  try {
    const whereClause = { userId };
    if (type) whereClause.type = type;

    return await Category.findAll({ where: whereClause });
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    return await Category.findOne({ where: whereClause });
  } catch (error) {
    console.error('Error getting category:', error);
    throw error;
  }
};

const create = async (userId, categoryData) => {
  try {
    return await Category.create({ ...categoryData, userId });
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

const updateById = async (userId, id, categoryData) => {
  try {
    const whereClause = { userId, id };

    return await Category.update(categoryData, {
      where: whereClause,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

const deleteById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    const deleted = await Category.destroy({ where: whereClause });

    return deleted;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
