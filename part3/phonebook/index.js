require('dotenv').config() // gets imported at first
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('content', function getContent (req) {
  return JSON.stringify(req.body)
})
const app = express() // create an express application
app.use(express.json()) // use express json parser to help access data
app.use(cors()) // use cors to allow for requests from all origins
app.use(express.static('build')) // make express show static content
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content')) // use morgan for logging in custom format
const Person = require('./models/person') // import the mongoose model

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
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// Route for deleting a single resource; Test with REST Client
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id) // filter out deleted resource

  response.status(204).end() // respond with status code 204 no content
})

// Route for adding a new resource; Test with REST Client
app.post('/api/persons', (request, response) => {
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
  /*
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
    error: 'name must be unique'
    })
  }
  */
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => { // save the new object to database
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})