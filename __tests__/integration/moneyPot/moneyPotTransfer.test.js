const MoneyPot = require('../../../src/models/MoneyPotModel');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('MoneyPot test transfer route', () => {
  let agent;
  let user;
  let moneyPots;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
    moneyPots = await MoneyPot.bulkCreate([
      {
        userId: user.id,
        name: 'Pot A',
        balance: 1000,
      },
      {
        userId: user.id,
        name: 'Pot B',
        balance: 1000,
      },
    ]);
  });

  afterAll(async () => {
    // Use helper to delete user
    await MoneyPot.destroy({
      where: { userId: user.id },
    });
    await deleteUser(user.id);
  });

  it('should transfer money from pot to pot', async () => {
    const response = await agent.post('/api/money-pots/transfer').send({
      amount: 500.50,
      fromPotId: moneyPots[0].id,
      toPotId: moneyPots[1].id,
    });
    expect(response.statusCode).toEqual(200);
    await MoneyPot.findByPk(moneyPots[0].id).then((pot) => {
      expect(pot.balance).toBe('499.50');
    });
    await MoneyPot.findByPk(moneyPots[1].id).then((pot) => {
      expect(pot.balance).toBe('1500.50');
    });
  });
});
