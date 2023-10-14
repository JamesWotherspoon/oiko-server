const request = require('supertest');
const app = require('../../src/app');
const Category = require('../../src/models/Category');

const agent = request.agent(app);

describe('Category routes', () => {
  describe('GET /categories', () => {
    it('should return an empty array when there are no categories', async () => {
      const response = await agent.get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an array of categories when there are categories', async () => {
      await Category.bulkCreate([{ name: 'Food' }, { name: 'Entertainment' }]);
      const response = await agent.get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, name: 'Food' },
        { id: 2, name: 'Entertainment' },
      ]);
    });
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const response = await agent.post('/api/categories').send({ name: 'Food' });
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, name: 'Food' });
    });

    it('should return a 400 error when the name is missing', async () => {
      const response = await agent.post('/api/categories').send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Name is required' });
    });
  });

  describe('PUT /categories/:id', () => {
    it('should update an existing category', async () => {
      const category = await Category.create({ name: 'Food' });
      const response = await agent.put(`/api/categories/${category.id}`).send({ name: 'Groceries' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, name: 'Groceries' });
    });

    it('should return a 404 error when the category does not exist', async () => {
      const response = await agent.put('/api/categories/1').send({ name: 'Groceries' });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Category not found' });
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete an existing category', async () => {
      const category = await Category.create({ name: 'Food' });
      const response = await agent.delete(`/api/categories/${category.id}`);
      expect(response.status).toBe(204);
      const categories = await Category.findAll();
      expect(categories).toEqual([]);
    });

    it('should return a 404 error when the category does not exist', async () => {
      const response = await agent.delete('/api/categories/1');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Category not found' });
    });
  });
});
