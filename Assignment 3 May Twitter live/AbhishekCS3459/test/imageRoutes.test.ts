import request from 'supertest';
import app from '../src/app';

describe('Image API Tests', () => {
  it('should return uploaded images', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.images)).toBe(true);
  });

  it('should return paginated search results', async () => {
    const res = await request(app).get('/api/images/search?name=test&page=1&limit=6');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });
});
