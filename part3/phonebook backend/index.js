const { request, response } = require('express')
const express = require('express')
const app = express() //create an express application
app.use(express.json()) //use express json parser to help access data
const morgan = require('morgan') 
//app.use(morgan('tiny')) //use morgan for logging in tiny format
morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content')) //use morgan for logging in custom format

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Route for fetching all resources
app.get('/api/persons', (request, response) => {
    response.json(persons) //send the notes array as a JSON formatted string
  })

//Route for displaying info
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date()} </p>`) //show the time that the request was received
})

//Route for fetching a single resource
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) //convert id to integer to match persons.id
    const person = persons.find(person => person.id === id)

    //if the person is undefined(false), respond with status 404
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//Route for deleting a single resource; Test with REST Client
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id) //filter out deleted resource

    response.status(204).end() //respond with status code 204 no content
})

const generateId = () => {
    return Math.floor(Math.random() * 10000) //generate a random number between 0 and 10000
}

//Route for adding a new resource; Test with REST Client
app.post('/api/persons', (request, response) => {
    const body = request.body //access the data
    //Handle errors and respond with status code 400 bad request
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
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
        error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
      }

    persons = persons.concat(person) //append the new person
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})