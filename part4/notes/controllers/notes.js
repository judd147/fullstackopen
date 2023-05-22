/* THIS FLIE DEFINES ROUTE HANDLERS */

const notesRouter = require('express').Router() // create a new router object
const Note = require('../models/note') // import the database schema

// Route for fetching all resources
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}) // fetch all notes from MongoDB
  response.json(notes) // send the notes array as a JSON formatted string
})

// Route for fetching a single resource
notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    // error handling
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception) // continue to the custom error handler middleware
  }
})

// Route for adding a new resource
notesRouter.post('/', async (request, response, next) => {
  const body = request.body // access the data from the body property of the request object
  // The content property must not be empty, respond with status code 400 bad request
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false, // If the property does not exist, the expression will evaluate to false
  })

  try {
    const savedNote = await note.save() // save the new object to database
    response.status(201).json(savedNote) // respond with status code 201 created
  } catch(exception) {
    next(exception) // continue to the custom error handler middleware
  }
})

// Route for deleting resources
notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end() // respond with status code 204 no content
  } catch(exception) {
    next(exception) // continue to the custom error handler middleware
  }
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