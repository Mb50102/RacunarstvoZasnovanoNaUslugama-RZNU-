const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('geting all users', async()=>{
    await request(app).get('/api/users')
    .set('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNlNTIwMDAzMDRhOTMzZjRiMmZiYzkiLCJpYXQiOjE2MDczNTg4ODh9.dLWh367vwOHE44Ezaul1X8kwqTN0uuzEinSTYIHPlTE')
    .expect(200)   
})