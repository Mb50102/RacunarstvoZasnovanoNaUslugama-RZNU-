const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('delete books by id', async()=>{
    await request(app).delete('/api/books/5fd09412270431957618422c')
    .expect(200);
})