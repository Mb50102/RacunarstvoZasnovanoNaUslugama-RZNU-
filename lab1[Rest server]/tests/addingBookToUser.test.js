const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');


test('geting all books from user', async()=>{
    await request(app).post('/api/users/5fcfc65ea66dc13b64b5aca0/books')
    .set('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNlNTIwMDAzMDRhOTMzZjRiMmZiYzkiLCJpYXQiOjE2MDczNTg4ODh9.dLWh367vwOHE44Ezaul1X8kwqTN0uuzEinSTYIHPlTE')
    .send({
        "bookid": "5fcf7576bbf2e638a8cc8ed3"
    })
    .expect(201)   
})