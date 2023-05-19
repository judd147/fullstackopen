const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // import the Express application

const api = supertest(app) // superagent object that can make HTTP requests to the backend

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200) // verify responded status code
    .expect('Content-Type', /application\/json/) // verify the Content-Type header using regex
}, 100000) // set timeout

afterAll(async () => {
  await mongoose.connection.close() // close the database connection after all tests finish running
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  expect(response.body).toHaveLength(2)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe('HTML is easy')
})