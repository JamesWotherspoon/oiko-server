const MoneyPot = require('../../../src/models/MoneyPotModel');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('MoneyPot test routes', () => {
  let agent;
  let user;
  let moneyPots;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
    moneyPots = await MoneyPot.bulkCreate([
      {
        userId: user.id,
        name: 'My MoneyPot #1',
        balance: 1000,
      },
      {
        userId: user.id,
        name: 'My MoneyPot #2',
        balance: 1000,
      },
      {
        userId: user.id,
        name: 'My MoneyPot #3',
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

  it('should create a new moneyPot', async () => {
    const response = await agent.post('/api/money-pots').send({
      name: 'My MoneyPot',
      balance: 1000,
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body.name).toBe('My MoneyPot');
    await MoneyPot.destroy({
      where: { id: response.body.id },
    });
  });

  it('should get all moneyPots', async () => {
    const response = await agent.get('/api/money-pots');
    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBe(3);
  });

  it('should get a single moneyPot', async () => {
    const response = await agent.get(`/api/money-pots/${moneyPots[0].id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toBe(moneyPots[0].name);
  });

  it('should update a moneyPot', async () => {
    const response = await agent.put(`/api/money-pots/${moneyPots[1].id}`).send({
      name: 'My Updated MoneyPot',
      balance: 2000,
      description: 'My Updated MoneyPot Description',
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.updated).toBe(true);
  });

  it('should delete a moneyPot', async () => {
    const response = await agent.delete(`/api/money-pots/${moneyPots[2].id}`);
    expect(response.statusCode).toEqual(200);
  });
});
