require('dotenv').config() // gets imported at first
const express = require('express')
const cors = require('cors')
const Note = require('./models/note') // import the mongoose model
const app = express() // create an express application

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// custom Express error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }) // respond with status code 400 Bad Request
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message }) // handle validation errors
  }
  next(error) // else, passes the error forward to the default Express error handler
}

app.use(express.json()) // use express json parser to help access data
app.use(cors()) // use cors to allow for requests from all origins
app.use(express.static('build')) // make express show static content

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
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    // error handling
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }) // additional catch if promise is rejected
  .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for deleting resources
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end() // respond with status code 204 no content
  })
  .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for updating resources(toggle importance)
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' }) // cause our event handler to be called with the new modified document
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for adding a new resource
app.post('/api/notes', (request, response) => {
  const body = request.body // The event handler can access the data from the body property of the request object
  // The content property may not be empty, respond with status code 400 bad request
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

app.use(unknownEndpoint) // next to the last middleware
app.use(errorHandler) // this has to be the last loaded middleware

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
