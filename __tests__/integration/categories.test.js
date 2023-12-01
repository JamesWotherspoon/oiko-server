const Category = require('../../src/models/CategoryModel');
const { createUserAndLogin, deleteUser } = require('../testHelpers');
const { generateCategoryResource } = require('../generateValidResource');

describe('Category route tests', () => {
  let agent;
  let user;
  let itemResources;
  let singleItem;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
    itemResources = [
      generateCategoryResource(user.id),
      generateCategoryResource(user.id),
      generateCategoryResource(user.id),
      generateCategoryResource(user.id),
      generateCategoryResource(user.id),
    ];

    itemResources = await Category.bulkCreate(itemResources);
    singleItem = generateCategoryResource(user.id);
  });

  afterAll(async () => {
    await deleteUser(user.id);
  });

  afterEach(async () => {
    await Category.destroy({ where: { userId: user.id } });
  });

  test('Should get all user categories from the database', async () => {
    const response = await agent.get('/api/categories');
    console.log(response.body[0].userId, user.id)
    expect(response.status).toBe(200);
    expect(response.body[0].userId).toBe(user.id);
    expect(response.body.length).toBe(itemResources.length);
  });

  test('Should get a single category from database', async () => {
    const item = itemResources[1];
    const response = await agent.get(`/api/categories/${item.id}`);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(item.userId);
    expect(response.body.name).toBe(item.name);
    expect(response.body.type).toBe(item.type);
    expect(response.body.description).toBe(item.description);
    expect(response.body.id).toBe(item.id);
  });

  test('Should add a new category to database', async () => {
    const response = await agent
      .post('/api/categories')
      .send(JSON.stringify(singleItem))
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    const category = await Category.findOne({
      where: { id: response.body.id },
    });
    expect(category.userId).toBe(user.id);
    expect(category.name).toBe(response.name);
  });

  test('Should update a category in the database', async () => {
    const response = await agent
      .put(`/api/categories/${itemResources[3].id}`)
      .send(JSON.stringify({ name: 'updated' }))
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(itemResources[3].id);
    expect(response.body.name).toBe('updated');
  });

  test('Should delete a category from the database', async () => {
    const response = await agent.delete(`/api/categories/${itemResources[4].id}`);
    expect(response.status).toBe(200);
    const deletedCategory = await Category.findOne({
      where: { id: itemResources[4].id, userId: user.id },
    });
    expect(deletedCategory).toBe(null);
  });
});
