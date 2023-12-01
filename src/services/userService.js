const User = require('../models/UserModel');
const { hashPassword } = require('../utils/authUtils');
const { normalizeText } = require('../utils/sanitizeUtils');
const { CustomError } = require('../utils/customErrorUtils');

const create = async (userData) => {
  const { email, password } = userData;
  const normalizedEmail = normalizeText(email);
  const passwordHash = await hashPassword(password);

  // Check if the user with the same email already exists
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) throw new CustomError('Email already exists', 'EMAIL_ALREADY_EXISTS', 409);

  const user = await User.create({ email: normalizedEmail, passwordHash });
  return user;
};

const retrieveById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

const updateById = async (id, userData) => {
  const { email, password } = userData;

  const user = await User.update({ email, password }, { where: { id } });

  return user;
};

const deleteById = async (id) => {
  const user = await User.destroy({ where: { id } });
  return user;
};
module.exports = {
  retrieveById,
  create,
  updateById,
  deleteById,
};
