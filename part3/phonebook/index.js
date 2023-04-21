require('dotenv').config() // gets imported at first
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body)
})
const Person = require('./models/person') // import the mongoose model
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
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content')) // use morgan for logging in custom format

// Route for fetching all resources
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => { // fetch all notes from Mongo
    response.json(persons) // send the notes array as a JSON formatted string
  })
})

// Route for displaying info
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date()} </p>`) // show the time that the request was received
  })
})

// Route for fetching a single resource
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    // error handling
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }) // additional catch if promise is rejected
  .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for deleting a single resource; Test with REST Client
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end() // respond with status code 204 no content
  })
  .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for updating resources(update number)
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true }) // cause our event handler to be called with the new modified document
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error)) // continue to the custom error handler middleware
})

// Route for adding a new resource; Test with REST Client
app.post('/api/persons', (request, response, next) => {
  const body = request.body // access the data
  // Handle errors and respond with status code 400 bad request
  if (!body.name) {
    return response.status(400).json({ 
    error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({
    error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => { // save the new object to database
    response.json(savedPerson)
  })
  .catch(error => next(error)) // continue to the custom error handler middleware
})

app.use(unknownEndpoint) // next to the last middleware
app.use(errorHandler) // this has to be the last loaded middleware

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})