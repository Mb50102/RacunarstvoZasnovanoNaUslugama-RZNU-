const { TestScheduler } = require('jest');
const request = require('supertest');
const app= require('../app');

test('Should sign up for a user', async()=>{
    await request(app).post('/api/register')
    .send({
        name:'test123456',
        email:'test@gmail.com',
        password:'123456789'
    })
    .expect(201)
    
})