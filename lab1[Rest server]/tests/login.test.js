const { TestScheduler } = require('jest');
const request = require('supertest');
const app= require('../app');

test('Should sign in', async()=>{
    await request(app).post('/api/login')
    .send({
        email:'marko@gmail.com',
        password:'123455678'
    })
    .expect(200)
    
})
