const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('update book by id', async()=>{
    await request(app).put('/api/users/5fcfed3093a53122480e35fb').send({
        "name": "kraljevic luka",
        "email": "hej@makro.gmail.com",
        "password": "flkačjčf"
        
    })
    .expect(200);
})
