/* THIS FLIE DEFINES NOTE ROUTE HANDLERS */

const notesRouter = require('express').Router() // create a new router object
const Note = require('../models/note') // import the database schema
const User = require('../models/user')

// Route for fetching all resources
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 }) // fetch all notes from MongoDB and reference users
  response.json(notes) // send the notes array as a JSON formatted string
})

// Route for fetching a single resource
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  // error handling
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Route for adding a new resource
notesRouter.post('/', async (request, response) => {
  const body = request.body // access the data from the body property of the request object
  // The content property must not be empty, respond with status code 400 bad request
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = await User.findById(body.userId) // information about the user is sent in the userId field

  const note = new Note({
    content: body.content,
    important: body.important || false, // If the property does not exist, the expression will evaluate to false
    user: user.id
  })

  const savedNote = await note.save() // save the new object to database
  user.notes = user.notes.concat(savedNote._id) // link noteID to user
  await user.save() // save the user object to database
  response.status(201).json(savedNote) // respond with status code 201 created
})

// Route for deleting resources
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end() // respond with status code 204 no content
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