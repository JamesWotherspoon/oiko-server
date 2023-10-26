const getNextTransactionDate = require('../../src/services/scheduledTransaction/getNextTransactionDate');

describe('getNextTransactionDate', () => {
  it('should return the next date for daily recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'daily';
    const nextTransactionDate = getNextTransactionDate({ recurrenceType, selectedTransactionDate });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-08-02');
  });

  it('should return the next date for weekly recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'weekly';
    const nextTransactionDate = getNextTransactionDate({
      recurrenceType,
      dayOfWeek: 'Wednesday',
      selectedTransactionDate,
    });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-08-04');
  });

  it('should return the next date for monthly recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'monthly';
    const nextTransactionDate = getNextTransactionDate({ recurrenceType, dateOfMonth: 15, selectedTransactionDate });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-09-15');
  });

  it('should return the next date for quarterly recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'quarterly';
    const nextTransactionDate = getNextTransactionDate({ recurrenceType, dateOfMonth: 15, selectedTransactionDate });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-11-15');
  });

  it('should return the next date for biannually recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'biannually';
    const nextTransactionDate = getNextTransactionDate({ recurrenceType, dateOfMonth: 15, selectedTransactionDate });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2022-02-15');
  });

  it('should return the next date for annually recurrence', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'annually';
    const nextTransactionDate = getNextTransactionDate({
      recurrenceType,
      dateOfMonth: 15,
      monthOfYear: 11,
      selectedTransactionDate,
    });
    expect(nextTransactionDate.substring(0, 10)).toEqual('2022-12-15');
  });

  it('should throw an error for invalid recurrence type', () => {
    const selectedTransactionDate = '2021-08-01';
    const recurrenceType = 'invalid';
    expect(() => getNextTransactionDate({ recurrenceType, selectedTransactionDate })).toThrow(
      'Invalid recurrence type',
    );
  });
});
