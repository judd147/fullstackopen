/* THIS FLIE DEFINES ROUTE HANDLERS */

const notesRouter = require('express').Router() // create a new router object
const Note = require('../models/note') // import the database schema

// Route for fetching all resources
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => { // fetch all notes from MongoDB
    response.json(notes) // send the notes array as a JSON formatted string
  })
})

// Route for fetching a single resource
notesRouter.get('/:id', (request, response, next) => {
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

// Route for adding a new resource
notesRouter.post('/', (request, response, next) => {
  const body = request.body // access the data from the body property of the request object
  // The content property must not be empty, respond with status code 400 bad request
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
    .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for deleting resources
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end() // respond with status code 204 no content
  })
    .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for updating resources(toggle importance)
notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' }) // cause our event handler to be called with the new modified document
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error)) // continue to the custom error handler middleware
})

module.exports = notesRouter