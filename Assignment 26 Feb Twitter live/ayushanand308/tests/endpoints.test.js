const req = require('supertest'); 
const express = require('express');
const api = require('../endpoints');

const app = express();
app.use(express.json());
app.use('/api/v0', api);

describe('Book API', () => {
  describe('GET /books', () => {
    it('gets all books', async () => {
      const r = await req(app).get('/api/v0/books');
      expect(r.statusCode).toBe(200);
      expect(Array.isArray(r.body)).toBeTruthy();
      expect(r.body.length).toBeGreaterThan(0);
    });

    it('filters by genre', async () => {
      const r = await req(app).get('/api/v0/books?genre=Fantasy');
      expect(r.statusCode).toBe(200);
      expect(Array.isArray(r.body)).toBeTruthy();
      r.body.forEach(b => {
        expect(b.genre).toBe('Fantasy');
      });
    });
  });

  describe('GET book by id', () => {
    it('gets a book', async () => {
      const r = await req(app).get('/api/v0/books/1');
      expect(r.statusCode).toBe(200);
      expect(r.body.id).toBe('1');
    });

    it('404s for missing books', async () => {
      const r = await req(app).get('/api/v0/books/999');
      expect(r.statusCode).toBe(404);
      expect(r.body.message).toBe('book not found');
    });
  });
  
  describe('POST /books', () => {
    it('creates books', async () => {
      const b = {
        title: "Test Book",
        author: "Some Guy",
        publicationYear: 2024,
        genre: "Fiction",
        rating: 4.5,
        description: "Test book desc",
        metadata: {
          pages: 300,
          stockLeft: 50,
          price: 19.99,
          discount: 0,
          edition: 1
        }
      };

      const r = await req(app)
        .post('/api/v0/books')
        .send(b);
      
      expect(r.statusCode).toBe(201);
      expect(r.body).toHaveProperty('id');
      expect(r.body.title).toBe(b.title);
    });
  });

  describe('PATCH rating', () => {
    it('updates ratings', async () => {
      const r = await req(app)
        .patch('/api/v0/books/1/rating')
        .send({ rating: 4.5 });
      
      expect(r.statusCode).toBe(200);
      expect(r.body.rating).toBe(4.5);
    });

    it('rejects bad ratings', async () => {
      const r = await req(app)
        .patch('/api/v0/books/1/rating')
        .send({ rating: 6 });
      
      expect(r.statusCode).toBe(400); 
    });

    it('404s on missing book', async () => {
      const r = await req(app)
        .patch('/api/v0/books/999/rating')
        .send({ rating: 4 });
      
      expect(r.statusCode).toBe(404);
    });
  });

  describe('GET stats', () => {
    it('returns stats', async () => {
      const r = await req(app).get('/api/v0/statistics');
      expect(r.statusCode).toBe(200);
      expect(r.body).toHaveProperty('avgRatingByGenre');
      expect(r.body).toHaveProperty('oldestBook');
      expect(r.body).toHaveProperty('newestBook');
    });
  });

  describe('search endpoint', () => {
    it('basic search works', async () => {
      const r = await req(app)
        .get('/api/v0/search')
        .query({ filter: 'rating > 4' });
      
      expect(r.statusCode).toBe(200);
      expect(Array.isArray(r.body)).toBeTruthy();
      r.body.forEach(b => {
        expect(b.rating).toBeGreaterThan(4);
      });
    });

    it('AND search works', async () => {
      const r = await req(app)
        .get('/api/v0/search')
        .query({ filter: 'rating > 4 AND metadata.price < 20' });
      
      expect(r.statusCode).toBe(200);
      r.body.forEach(b => {
        expect(b.rating).toBeGreaterThan(4);
        expect(b.metadata.price).toBeLessThan(20);
      });
    });

    it('OR search works too', async () => {
      const r = await req(app)
        .get('/api/v0/search')
        .query({ filter: 'rating > 4 OR metadata.price < 10' });
      
      expect(r.statusCode).toBe(200);
      r.body.forEach(b => {
        expect(b.rating > 4 || b.metadata.price < 10).toBeTruthy();
      });
    });
  });
});