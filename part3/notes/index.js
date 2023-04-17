require('dotenv').config() // gets imported at first
const express = require('express')
const cors = require('cors')
const app = express() // create an express application
app.use(express.json()) // use express json parser to help access data
app.use(cors()) // use cors to allow for requests from all origins
app.use(express.static('build')) // make express show static content
const Note = require('./models/note') // import the mongoose model

// The first route defines an event handler that handles HTTP GET requests made to the application's root
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>') // the server respond to the HTTP request by sending the string Hello World!
})

// Route for fetching all resources
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => { // fetch all notes from Mongo
    response.json(notes) // send the notes array as a JSON formatted string
  })
})

// Route for fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// Route for deleting resources
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end() // respond with status code 204 no content
})

// Route for adding a new resource
app.post('/api/notes', (request, response) => {
  const body = request.body //The event handler can access the data from the body property of the request object
  //The content property may not be empty, respond with status code 400 bad request
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false, // If the property does not exist, the expression will evaluate to false
  })

  note.save().then(savedNote => { // save the new object to database
    response.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
