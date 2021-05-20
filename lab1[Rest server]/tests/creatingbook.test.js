const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('create book', async()=>{
    await request(app).post('/api/books').send({
        "name": "nova knjiga",
        "author": "marko"
    })
    .expect(201);
})