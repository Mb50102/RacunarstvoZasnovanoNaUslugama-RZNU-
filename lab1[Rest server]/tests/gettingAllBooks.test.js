const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');


test('fetching books by id', async()=>{
    await request(app).get('/api/books')
    .expect(200)   
})