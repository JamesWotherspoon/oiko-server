function getNextTransactionDate(recurrenceType, dayOfWeek, dateOfMonth, monthOfYear, lastTransactionDate) {
  const lastDate = lastTransactionDate ? new Date(lastTransactionDate) : new Date();
  const nextDate = lastDate;

  switch (recurrenceType) {
  case 'daily':
    nextDate.setDate(lastDate.getDate() + 1);
    break;
  case 'weekly':
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);
    const daysUntilNext = (dayIndex - lastDate.getDay() + 7) % 7;
    nextDate.setDate(lastDate.getDate() + daysUntilNext);
    break;
  case 'monthly':
    nextDate.setMonth(lastDate.getMonth() + 1);
    nextDate.setDate(dateOfMonth);
    break;
  case 'quarterly':
    nextDate.setMonth(lastDate.getMonth() + 3);
    nextDate.setDate(dateOfMonth);
    break;
  case 'biannually':
    nextDate.setMonth(lastDate.getMonth() + 6);
    nextDate.setDate(dateOfMonth);
    break;
  case 'annually':
    nextDate.setFullYear(lastDate.getFullYear() + 1);
    nextDate.setMonth(monthOfYear);
    nextDate.setDate(15);
    break;
  default:
    throw new Error('Invalid recurrence type');
  }
  nextDate.setUTCHours(4);

  return nextDate.toISOString();
}

module.exports = getNextTransactionDate;
