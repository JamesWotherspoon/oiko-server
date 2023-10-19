const getNextTransactionDate = require('../../src/services/scheduledTransaction/getNextTransactionDate');

describe('getNextTransactionDate', () => {
  it('should return the next date for daily recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('daily', null, null, null, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-08-02');
  });

  it('should return the next date for weekly recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('weekly', 'Wednesday', null, null, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-08-04');
  });

  it('should return the next date for monthly recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('monthly', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-09-15');
  });

  it('should return the next date for quarterly recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('quarterly', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2021-11-15');
  });

  it('should return the next date for biannually recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('biannually', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2022-02-15');
  });

  it('should return the next date for annually recurrence', () => {
    const lastTransactionDate = '2021-08-01';
    const nextTransactionDate = getNextTransactionDate('annually', null, 15, 11, lastTransactionDate);
    expect(nextTransactionDate.substring(0, 10)).toEqual('2022-12-15');
  });

  it('should throw an error for invalid recurrence type', () => {
    const lastTransactionDate = '2021-08-01';
    expect(() => getNextTransactionDate('invalid', null, null, null, lastTransactionDate)).toThrow(
      'Invalid recurrence type',
    );
  });
});
