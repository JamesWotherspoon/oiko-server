const Category = require('../../src/models/CategoryModel');
const { createUserAndLogin, deleteUser } = require('../testHelpers');

describe('Category route tests', () => {
  let agent;
  let user;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
  });

  afterAll(async () => {
    // Use helper to delete user
    await deleteUser(user.id);
  });

  afterEach(async () => {
    // Delete all categories from the database
    await Category.destroy({
      where: { userId: user.id },
    });
  });

  test('Should get all user categories from the database', async () => {
    await Category.bulkCreate([
      {
        userId: user.id,
        name: 'Test Category',
        type: 'income',
        description: 'Test Category Description',
      },
      {
        userId: user.id,
        name: 'Test Category 2',
        type: 'income',
        description: 'Test Category 2 Description',
      },
    ]);

    const response = await agent.get('/api/categories');
    expect(response.status).toBe(200);
    expect(response.body[0].userId).toBe(user.id);
    expect(response.body[0].name).toBe('Test Category');
    expect(response.body[0].type).toBe('income');
    expect(response.body[0].description).toBe('Test Category Description');
  });

  test('Should get a single category from database', async () => {
    // Create a category to retrieve
    const category = await Category.create({
      userId: user.id,
      name: 'Test Category',
      type: 'expense',
      description: 'Test Category Description',
    });
    // Create a second category to ensure that the correct category is returned
    await Category.create({
      userId: user.id,
      name: 'Other Category',
      type: 'income',
      description: 'Other Category Description',
      color: '#00FF00',
    });
    const response = await agent.get(`/api/categories/${category.id}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.name).toBe('Test Category');
    expect(response.body.type).toBe('expense');
    expect(response.body.description).toBe('Test Category Description');
    expect(response.body.id).toBe(category.id);
  });

  test('Should add a new category to database', async () => {
    const response = await agent
      .post('/api/categories')
      .send(
        JSON.stringify({
          name: 'Test Category',
          type: 'income',
          description: 'Test Category Description',
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);

    const category = await Category.findOne({
      where: { id: response.body.id },
    });

    expect(category.userId).toBe(user.id);
    expect(category.name).toBe('Test Category');
    expect(category.type).toBe('income');
    expect(category.description).toBe('Test Category Description');
  });

  test('Should update a category in the database', async () => {
    const category = await Category.create({
      userId: user.id,
      name: 'Test Category',
      type: 'expense',
      description: 'Test Category Description',
    });

    const updatedCategoryName = 'Updated Category';
    const updatedCategoryType = 'income';
    const updatedCategoryDescription = 'Updated Category Description';

    const response = await agent
      .put(`/api/categories/${category.id}`)
      .send(
        JSON.stringify({
          name: updatedCategoryName,
          type: updatedCategoryType,
          description: updatedCategoryDescription,
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.updated).toBe(true);

    const updatedCategory = await Category.findOne({
      where: { userId: user.id },
    });

    expect(updatedCategory.name).toBe(updatedCategoryName);
    expect(updatedCategory.type).toBe(updatedCategoryType);
    expect(updatedCategory.description).toBe(updatedCategoryDescription);
  });

  test('Should delete a category from the database', async () => {
    const category = await Category.create({
      userId: user.id,
      name: 'Test Category',
      type: 'expense',
      description: 'Test Category Description',
    });

    const response = await agent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(200);
    const deletedCategory = await Category.findOne({
      where: { id: category.id, userId: user.id },
    });
    expect(deletedCategory).toBe(null);
  });

  it('should return categories filtered by type', async () => {
    await Category.bulkCreate([
      {
        userId: user.id,
        name: 'Other Category',
        type: 'expense',
        description: 'Other Category Description',
      },
      {
        userId: user.id,
        name: 'income Category',
        type: 'income',
        description: 'income Category Description',
      },
    ]);
    const response = await agent.get(`/api/categories?type=income`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('income Category');
    expect(response.body[0].type).toBe('income');
  });
});
