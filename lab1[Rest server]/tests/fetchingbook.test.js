const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');


test('fetching books by id', async()=>{
    await request(app).get('/api/books/5fcf7576bbf2e638a8cc8ed3')
    .expect(200)
    .then(response=>{
        expect(response.body).toHaveProperty('_id',
        'name',
        'author',
        '__v')
    });
   
})