const uniqueNumberConstructor = () => {
  let number = 0;

  return () => {
    number += 1;
    return number;
  };
};

const uniqueStringConstructor = () => {
  let number = 0;

  return () => {
    number += 1;
    return `string-${number}`;
  };
};

const generateRandomNumber = (upperRange) => {
  const number = Math.floor(Math.random() * upperRange);
  return number;
};

const generateDate = () => {
  const date = new Date();
  date.format('dd-MM-YYYY');
  return date;
};

const validTransactionTypes = ['positive', 'negative'];

const generateUniqueNumber = uniqueNumberConstructor();
const generateUniqueString = uniqueStringConstructor();

const generateCategoryResource = (userId) => {
  return {
    userId,
    type: validTransactionTypes[generateRandomNumber(1)],
    name: generateUniqueString(),
    color: '#808080',
    iconIdentifier: generateUniqueString(),
    description: generateUniqueString(),
  };
};

const generateTransactionResource = (categoryId, moneyPotId) => {
  return {
    categoryId,
    transactionType: validTransactionTypes[generateRandomNumber(1)],
    name: generateUniqueString(),
    amount: generateUniqueNumber(),
    transactionDate: generateDate(),
    description: generateUniqueString(),
    moneyPotId,
  };
};

const generateMoneyPotResource = () => {
  return {
    name: generateUniqueString(),
    balance: generateUniqueNumber(),
    description: generateUniqueString(),
    balanceType: validTransactionTypes[generateRandomNumber(1)],
  };
};

const generateScheduledTransaction = (moneyPotId, categoryId) => {
  return {
    moneyPotId,
    categoryId,
    transactionType: validTransactionTypes[generateRandomNumber(1)],
    name: generateUniqueString(),
    amount: generateRandomNumber(1000),
    recurrenceType: 'annually',
    dayOfWeek: 'Sunday',
    dateOfMonth: generateRandomNumber(28),
    monthOfYear: 'January',
    selectedTransactionDate: generateDate(),
    active: true,
    description: generateUniqueString(),
  };
};

module.exports = {
  generateCategoryResource,
  generateTransactionResource,
  generateScheduledTransaction,
};
