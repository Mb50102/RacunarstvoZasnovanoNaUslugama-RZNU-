const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('update book by id', async()=>{
    await request(app).put('/api/books/5fcfee1a9bb6bb39a829c20a').send({
        "name": "kraljevic ivan",
        "author": "luka"
    })
    .expect(200);
})





