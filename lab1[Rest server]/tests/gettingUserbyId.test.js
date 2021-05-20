const { TestScheduler } = require('jest');
const request = require('supertest');
const { response } = require('../app');
const app= require('../app');

test('geting user by id', async()=>{
    await request(app).get('/api/users/5fcf92fd665f103a00b33372')
    .set('auth-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmNlNTIwMDAzMDRhOTMzZjRiMmZiYzkiLCJpYXQiOjE2MDczNTg4ODh9.dLWh367vwOHE44Ezaul1X8kwqTN0uuzEinSTYIHPlTE')
    .expect(200)  
    .then(response=>{
        expect(response.body.name).toBe('ivan'
    )});
     
})