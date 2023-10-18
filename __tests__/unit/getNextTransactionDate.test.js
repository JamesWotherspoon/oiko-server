const getNextTransactionDate = require('../../src/services/scheduledTransaction/getNextTransactionDate');

describe('getNextTransactionDate', () => {
  it('should return the next date for daily recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('daily', null, null, null, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2021-08-02T04:00:00.000Z');
  });

  it('should return the next date for weekly recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('weekly', 'Wednesday', null, null, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2021-08-04T04:00:00.000Z');
  });

  it('should return the next date for monthly recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('monthly', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2021-09-15T04:00:00.000Z');
  });

  it('should return the next date for quarterly recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('quarterly', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2021-11-15T04:00:00.000Z');
  });

  it('should return the next date for biannually recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('biannually', null, 15, null, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2022-02-15T04:00:00.000Z');
  });

  it('should return the next date for annually recurrence', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    const nextTransactionDate = getNextTransactionDate('annually', null, 15, 11, lastTransactionDate);
    expect(nextTransactionDate).toEqual('2022-12-15T04:00:00.000Z');
  });

  it('should throw an error for invalid recurrence type', () => {
    const lastTransactionDate = '2021-08-01T04:00:00.000Z';
    expect(() => getNextTransactionDate('invalid', null, null, null, lastTransactionDate)).toThrow(
      'Invalid recurrence type',
    );
  });
});
