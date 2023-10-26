const User = require('../models/UserModel');
const { hashPassword } = require('../utils/authUtils');
const { normalizeText } = require('../utils/sanitizeUtils');

const create = async (userData) => {
  try {
    const { email, password } = userData;
    const normalizedEmail = normalizeText(email);
    const passwordHash = await hashPassword(password);

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) throw new Error('Email already exists');

    const user = await User.create({ email: normalizedEmail, passwordHash });
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

const retrieveById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error('Failed to retrieve user');
  }
};

const updateById = async (id, userData) => {
  try {
    const { email, password } = userData;

    const user = await User.update({ email, password }, { where: { id } });

    return user;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

const deleteById = async (id) => {
  try {
    const user = await User.destroy({ where: { id } });
    return user;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};
module.exports = {
  retrieveById,
  create,
  updateById,
  deleteById,
};
