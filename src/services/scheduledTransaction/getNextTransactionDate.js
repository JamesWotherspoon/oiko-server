function getNextTransactionDate(recurrenceType, dayOfWeek, dateOfMonth, monthOfYear, selectedTransactionDate) {
  const currentDate = new Date();
  const selectedDate = selectedTransactionDate ? new Date(selectedTransactionDate) : new Date(currentDate);
  const nextDate = new Date(selectedDate);
  // If transaction date is in the future return future date
  if (selectedDate > currentDate) {
    return nextDate.toISOString();
  }

  switch (recurrenceType) {
  case 'daily':
    nextDate.setDate(selectedDate.getDate() + 1);
    break;
  case 'weekly':
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);
    const daysUntilNext = (dayIndex - selectedDate.getDay() + 7) % 7;
    nextDate.setDate(selectedDate.getDate() + daysUntilNext);
    break;
  case 'monthly':
    nextDate.setMonth(selectedDate.getMonth() + 1);
    nextDate.setDate(dateOfMonth || selectedDate.getDate());
    break;
  case 'quarterly':
    nextDate.setMonth(selectedDate.getMonth() + 3);
    nextDate.setDate(dateOfMonth || selectedDate.getDate());
    break;
  case 'biannually':
    nextDate.setMonth(selectedDate.getMonth() + 6);
    nextDate.setDate(dateOfMonth || selectedDate.getDate());
    break;
  case 'annually':
    nextDate.setFullYear(selectedDate.getFullYear() + 1);
    nextDate.setMonth(monthOfYear || selectedDate.getMonth());
    nextDate.setDate(dateOfMonth || selectedDate.getDate());
    break;
  default:
    throw new Error('Invalid recurrence type');
  }
  return nextDate.toISOString();
}

module.exports = getNextTransactionDate;
