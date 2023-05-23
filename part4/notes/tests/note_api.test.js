const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app') // import the Express application
const api = supertest(app) // superagent object that can make HTTP requests to the backend
const Note = require('../models/note') // import the database schema

beforeEach(async () => {
  await Note.deleteMany({}) // clear out database
  const noteObjects = helper.initialNotes.map(note => new Note(note)) // create an array of Mongoose objects (Note)
  const promiseArray = noteObjects.map(note => note.save()) // create an array of promises for saving notes to DB
  await Promise.all(promiseArray) // wait until every promise for saving a note is finished
}, 200000) // set timeout

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200) // verify responded status code
    .expect('Content-Type', /application\/json/) // verify the Content-Type header using regex
}, 200000) // set timeout

// Test for GET All
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  // execution gets here only after the HTTP request is complete
  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content) // content of every note returned by the API
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})

// Test for GET One
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultNote.body).toEqual(noteToView)
})

// Test for POST
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

// Test for DELETE
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})

afterAll(async () => {
  await mongoose.connection.close() // close the database connection after all tests finish running
})