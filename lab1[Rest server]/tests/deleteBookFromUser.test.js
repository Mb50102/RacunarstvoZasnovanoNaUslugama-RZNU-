const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');


test('delete book from user', async()=>{
    await request(app).delete('/api/users/5fcfc65ea66dc13b64b5aca0/books/62')
    .set('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNlNTIwMDAzMDRhOTMzZjRiMmZiYzkiLCJpYXQiOjE2MDczNTg4ODh9.dLWh367vwOHE44Ezaul1X8kwqTN0uuzEinSTYIHPlTE')
    .expect(200)   
})